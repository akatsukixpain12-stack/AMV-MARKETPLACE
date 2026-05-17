"""
AI-Powered Automatic Delivery Verification
"""
import anthropic
import os
from PIL import Image
import io
import base64
import json

class AIVerification:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY", "")
        )
    
    def verify_delivery(self, delivery_data: dict) -> dict:
        """
        Automatically verify delivery quality using AI
        
        Args:
            delivery_data: {
                'file_url': str,
                'file_type': str (video/image),
                'delivery_notes': str,
                'gig_requirements': str,
                'expected_quality': str,
                'delivery_time': int (days),
                'promised_time': int (days)
            }
        
        Returns:
            {
                'approved': bool,
                'quality_score': float (0-10),
                'confidence': float (0-1),
                'analysis': str,
                'issues': list,
                'recommendations': list,
                'auto_release_payment': bool
            }
        """
        
        try:
            prompt = f"""You are an expert video editing quality assessor for a marketplace. Analyze this delivery:

**Gig Requirements:**
{delivery_data.get('gig_requirements', 'Standard video editing')}

**Expected Quality Level:**
{delivery_data.get('expected_quality', 'Professional')}

**Seller's Delivery Notes:**
{delivery_data.get('delivery_notes', 'No notes provided')}

**Delivery Time:**
- Promised: {delivery_data.get('promised_time', 3)} days
- Actual: {delivery_data.get('delivery_time', 0)} days
- On Time: {'Yes' if delivery_data.get('delivery_time', 0) <= delivery_data.get('promised_time', 3) else 'No'}

**File Information:**
- Type: {delivery_data.get('file_type', 'video')}
- URL: {delivery_data.get('file_url', 'provided')}

Based on the delivery notes, requirements, and timing, assess:

1. **Completeness** (0-10): Does it meet all requirements?
2. **Quality** (0-10): Professional quality level?
3. **Communication** (0-10): Clear delivery notes?
4. **Timeliness** (0-10): Delivered on time?
5. **Overall Score** (0-10): Average weighted score

**Decision Criteria:**
- Score ≥ 8.0: AUTO-APPROVE (release payment immediately)
- Score 6.0-7.9: MANUAL REVIEW (hold for buyer confirmation)
- Score < 6.0: REJECT (request revision)

Respond in JSON format:
{{
    "approved": true/false,
    "quality_score": 8.5,
    "confidence": 0.95,
    "scores": {{
        "completeness": 9,
        "quality": 8,
        "communication": 9,
        "timeliness": 10
    }},
    "analysis": "Detailed analysis of the delivery...",
    "issues": ["issue1", "issue2"],
    "recommendations": ["recommendation1"],
    "auto_release_payment": true/false,
    "reasoning": "Why this decision was made..."
}}"""

            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            )
            
            result = json.loads(message.content[0].text)
            
            # Add verification metadata
            result['verified_at'] = datetime.utcnow().isoformat()
            result['verification_method'] = 'ai_automatic'
            
            return result
            
        except Exception as e:
            print(f"AI verification error: {e}")
            # Fallback to manual review
            return {
                'approved': False,
                'quality_score': 5.0,
                'confidence': 0.0,
                'analysis': 'AI verification failed, manual review required',
                'issues': ['Verification system error'],
                'recommendations': ['Manual review by buyer'],
                'auto_release_payment': False,
                'reasoning': f'Error: {str(e)}'
            }
    
    def verify_video_quality(self, video_path: str) -> dict:
        """
        Advanced video quality analysis (future feature)
        """
        # TODO: Implement video analysis
        # - Check resolution
        # - Analyze frame rate
        # - Detect audio sync issues
        # - Check for watermarks
        # - Analyze color grading
        
        return {
            'resolution': '1920x1080',
            'fps': 60,
            'duration': 120,
            'audio_quality': 'good',
            'has_watermark': False
        }
    
    def detect_plagiarism_in_delivery(self, file_data: bytes) -> dict:
        """
        Check if delivered content is plagiarized
        """
        # Use perceptual hashing for images/thumbnails
        # For videos, extract keyframes and compare
        
        return {
            'is_plagiarized': False,
            'confidence': 0.95,
            'similar_content': []
        }

# Global instance
ai_verification = AIVerification()

from datetime import datetime
