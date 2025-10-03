// auth/guards/admin.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    
    // Temporary - always return true until you implement admin logic
    console.log('AdminGuard: Temporarily allowing access');
    return true;
    
    // Future implementation:
    // return user && user.role === 'admin';
  }
}