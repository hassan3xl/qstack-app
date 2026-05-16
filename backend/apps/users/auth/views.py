from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()


class RegisterAPIView(APIView):
    """User registration endpoint."""
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "Registration successful",
                    "user": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "status": "error",
                "message": "Registration failed",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginAPIView(APIView):
    """User login endpoint with JWT tokens."""
    permission_classes = []

    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return Response(
                    {
                        "status": "error",
                        "message": "Email and password are required",
                        "type": "validation_error"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = authenticate(username=email, password=password)

            if user is None:
                return Response(
                    {
                        "status": "error",
                        "message": "Invalid email or password",
                        "type": "auth_error"
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Check if user is active
            if not user.is_active:
                return Response(
                    {
                        "status": "error",
                        "message": "User account is disabled",
                        "type": "inactive_user"
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            # Check staff profile if it exists
            try:
                staff_profile = user.staff_profile
                if staff_profile.active_status != 'active':
                    return Response(
                        {
                            "status": "error",
                            "message": f"Staff account status: {staff_profile.active_status}",
                            "type": "inactive_staff"
                        },
                        status=status.HTTP_403_FORBIDDEN
                    )
            except AttributeError:
                pass  # Not a staff member, that's OK

            # Generate tokens
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "status": "success",
                    "message": "Login successful",
                    "type": "login_success",
                    "tokens": {
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                    },
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "is_staff": user.is_staff,
                    }
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": f"An error occurred during login: {str(e)}",
                    "type": "server_error"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutAPIView(APIView):
    """User logout endpoint."""

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response(
                {
                    "status": "success",
                    "message": "Logout successful",
                    "type": "logout_success"
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Logout failed",
                    "type": "logout_error"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

