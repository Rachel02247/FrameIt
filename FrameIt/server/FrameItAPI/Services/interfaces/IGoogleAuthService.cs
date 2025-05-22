using static FrameItAPI.Entities.mapping.Auth;

namespace FrameItAPI.Services.interfaces
{
    public interface IGoogleAuthService
    {
        Task<GoogleLoginResult> LoginOrRegisterWithGoogleAsync(string credential);
    }

}
