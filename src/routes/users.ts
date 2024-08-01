import { Router } from 'express';
import { 
  getUsers, 
  createUser, 
  getUserById,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';


const router = Router();


router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/:avatar', updateUserAvatar);



export default router;