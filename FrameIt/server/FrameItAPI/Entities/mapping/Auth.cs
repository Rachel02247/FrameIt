namespace FrameItAPI.Entities.mapping
{
    public class Auth
    {
   

        public class LoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class RegisterModel
        {
            public string UserName { get; set; }
            public string Password { get; set; }
            public string Email { get; set; }
            public string RoleName { get; set; }
        }

        public class ChangePasswordRequest
        {
            public string Email { get; set; } = string.Empty;
            public string CurrentPassword { get; set; } = string.Empty;
            public string NewPassword { get; set; } = string.Empty;
        }

        public class GoogleLoginRequest
        {
            public string Credential { get; set; }
        }

        public class GoogleLoginResult
        {
            public bool IsSuccess { get; set; }
            public string Token { get; set; }
            public object User { get; set; }
        }

        public class GoogleAuthSettings
        {
            public string ClientId { get; set; }
            public string ClientSecret { get; set; }
        }

    }
}
