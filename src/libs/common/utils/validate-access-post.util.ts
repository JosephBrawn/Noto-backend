import { UserRole } from '@/users/entities/user.entity';

export function canUserModifyPost(
  userId: number,
  postUserId: number,
  roles: UserRole[],
): boolean {
  return (
    postUserId === userId ||
    roles.includes(UserRole.Moderator) ||
    roles.includes(UserRole.Admin)
  );
}
