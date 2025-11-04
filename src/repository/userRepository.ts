interface SimpleUser {
  id: number;
  email: string;
  password: string;
}

const MOCK_DB: SimpleUser[] = [
  { id: 101, email: 'exemplo@siae.com', password: 'senha123' },
  { id: 102, email: 'teste@siae.com', password: 'testepassword' },
];

export class UserRepository {
  
  public static async findUserByEmail(email: string): Promise<SimpleUser | undefined> {
    const user = MOCK_DB.find(u => u.email === email);
    return user;
  }
}