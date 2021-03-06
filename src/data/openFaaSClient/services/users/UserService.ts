// - Import react components
import { SocialError } from '~/core/domain/common';
import { User, UserProvider } from '~/core/domain/users';
import { IHttpService } from '~/core/services/webAPI';
import { SocialProviderTypes } from '~/core/socialProviderTypes';
import { fromJS, Map } from 'immutable';
import { inject, injectable } from 'inversify';
import { IUserService } from '~/core/services';

/**
 * Firbase user service
 */
@injectable()
export class UserService implements IUserService {

  @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService
  constructor(
  ) {
    this.getSearchKey = this.getSearchKey.bind(this)
    this.searchUser = this.searchUser.bind(this)
  }

  /**
   * Get user profile
   */
  public getUserProfile = async (userId: string) => {
    try {

      const result = await this._httpService.get(`profile/id/${userId}`)
      return {...result, userId: result.objectId, creationDate: result["created_date"]} as User
    } catch (error) {
      throw new SocialError(error.code, 'firestore/getUserProfile :' + error.message)
    }
  }

  /**
   * Get current user profile
   */
  public getCurrentUserProfile = async () => {
    try {

      const result = await this._httpService.get('profile/my')
    
      return {...result, userId: result.objectId, creationDate: result["created_date"]} as User
    } catch (error) {
      throw new SocialError(error.code, 'firestore/getUserProfile :' + error.message)
    }
  }

  /**
   * Update user profile
   */
  public updateUserProfile = async (userId: string, profile: User) => {
    const updateProfile$ =  this._httpService.put('auth/profile', { ...profile })
    await updateProfile$
    const updatePostProfile$ =  this._httpService.put('posts/profile')
    const updateCommentProfile$ =  this._httpService.put('comments/profile')
    await Promise.all([updateCommentProfile$,updatePostProfile$])

  }

  /**
   * Increase share count
   */
  public increaseShareCount = (userId: string) => {
    return " Not implemented!" as any

    }

  /**
   * Decrease share count
   */
  public decreaseShareCount = (userId: string) => {
    return " Not implemented!" as any

    }

  /**
   * Increase follow count
   */
  public increaseFollowCount = (userId: string) => {
    return " Not implemented!" as any

    }

  /**
   * Initialize user status
   */
  initUserStatus = (uid: string) => {
    return " Not implemented!" as any

  }

  /**
   * Decrease follow count
   */
  public decreaseFollowCount = (userId: string) => {
    return " Not implemented!" as any

    }

  /**
   * Search for user profile
   */
  public async searchUser(query: string, filters: string, page: number, limit: number, searchKey: string) {
        try {
      let resultSearch = await this._httpService.get(`profile?search=${query}&page=${page! + 1}&limit=${limit}`)

    const userCount = resultSearch ? resultSearch.length : 0
    let parsedData: Map<string, any> = Map({})
    let userIds: Map<string, boolean> =  Map({})
    if (resultSearch) {
      resultSearch.forEach((user: any) => {
        if (user.objectId !== filters) {
          parsedData = parsedData.set(user.objectId!, fromJS({ ...user, userId: user.objectId, creationDate: user["created_date"]  }))
          userIds = userIds.set(user.objectId!, true)
          
        }
      })
    }

    return { users: parsedData, ids: userIds, newLastPostId: userCount > 0  ? resultSearch[0].objectId : '', hasMore: !(userCount < (limit || 10)) }

    } catch (error) {
      throw new SocialError(error.code, error.message)
    }
  }

  /**
   * Get search key
   */
  public async getSearchKey() {
    return ""
  }

  /**
   * Get users profile
   */
  public getUsersProfile = (userId: string, lastUserId?: string, page?: number, limit?: number) => {
    return "Not implemented" as any
  }
}
