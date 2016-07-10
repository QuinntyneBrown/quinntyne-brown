using QuinntyneBrown.Models;

namespace QuinntyneBrown.Dtos
{
    public class CurrentUserResponseDto: UserDto
    {
        public CurrentUserResponseDto(User entity)
            : base(entity)
        {

        }

        public CurrentUserResponseDto()
        {

        }
    }
}