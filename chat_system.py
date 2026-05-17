"""
Real-time Chat System with AI Moderation
"""
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime
from ai_manager import ai_manager
import json

class ChatSystem:
    def __init__(self, app, db):
        self.socketio = SocketIO(app, cors_allowed_origins="*")
        self.db = db
        self.setup_events()
    
    def setup_events(self):
        @self.socketio.on('connect')
        def handle_connect():
            print('Client connected')
        
        @self.socketio.on('disconnect')
        def handle_disconnect():
            print('Client disconnected')
        
        @self.socketio.on('join_chat')
        def handle_join_chat(data):
            """Join a chat room for an order"""
            order_id = data['order_id']
            user_id = data['user_id']
            
            room = f"order_{order_id}"
            join_room(room)
            
            emit('joined_chat', {
                'order_id': order_id,
                'message': 'Connected to chat'
            }, room=room)
        
        @self.socketio.on('send_message')
        def handle_send_message(data):
            """Send a message in order chat"""
            order_id = data['order_id']
            user_id = data['user_id']
            message = data['message']
            
            # AI content moderation
            moderation = ai_manager.moderate_content(message)
            
            if not moderation['is_appropriate']:
                emit('message_blocked', {
                    'reason': 'Message contains inappropriate content',
                    'issues': moderation['issues']
                })
                return
            
            # Save message to database
            from app import Message, User
            
            msg = Message(
                order_id=order_id,
                sender_id=user_id,
                content=message,
                timestamp=datetime.utcnow()
            )
            self.db.session.add(msg)
            self.db.session.commit()
            
            # Get sender info
            sender = User.query.get(user_id)
            
            # Broadcast to room
            room = f"order_{order_id}"
            emit('new_message', {
                'id': msg.id,
                'order_id': order_id,
                'sender': {
                    'id': sender.id,
                    'username': sender.username,
                    'profile_image': sender.profile_image
                },
                'content': message,
                'timestamp': msg.timestamp.isoformat()
            }, room=room)
        
        @self.socketio.on('typing')
        def handle_typing(data):
            """Broadcast typing indicator"""
            order_id = data['order_id']
            user_id = data['user_id']
            is_typing = data['is_typing']
            
            from app import User
            user = User.query.get(user_id)
            
            room = f"order_{order_id}"
            emit('user_typing', {
                'user': user.username,
                'is_typing': is_typing
            }, room=room, include_self=False)
        
        @self.socketio.on('mark_read')
        def handle_mark_read(data):
            """Mark messages as read"""
            order_id = data['order_id']
            user_id = data['user_id']
            
            from app import Message
            
            messages = Message.query.filter_by(
                order_id=order_id
            ).filter(Message.sender_id != user_id).all()
            
            for msg in messages:
                msg.is_read = True
            
            self.db.session.commit()
            
            room = f"order_{order_id}"
            emit('messages_read', {
                'order_id': order_id,
                'reader_id': user_id
            }, room=room)

# Initialize chat system (will be called from app.py)
chat_system = None

def init_chat_system(app, db):
    global chat_system
    chat_system = ChatSystem(app, db)
    return chat_system.socketio
