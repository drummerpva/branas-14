import { GetAccountAccountDAO } from './GetAccountAccountDAO'
import { SignupAccountDAO } from './SignupAccountDAO'

export interface AccountDAO extends GetAccountAccountDAO, SignupAccountDAO {}
