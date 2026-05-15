from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class StaffLoginForm(forms.Form):
    """Login form for staff and admin users."""
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form-control',
        'placeholder': 'Enter your email',
        'autofocus': True
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Enter your password'
    }))
    
    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                if not user.is_staff:
                    raise forms.ValidationError(
                        "Only staff and admin users can access this area."
                    )
                if not user.is_active:
                    raise forms.ValidationError(
                        "This user account is inactive."
                    )
            except User.DoesNotExist:
                raise forms.ValidationError(
                    "Invalid email or password."
                )
            
            user = authenticate(username=email, password=password)
            if not user:
                raise forms.ValidationError(
                    "Invalid email or password."
                )
        
        return cleaned_data
