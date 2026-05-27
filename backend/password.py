import bcrypt

def hash_pwd(password: str, rounds = 12) -> bytes:
    if check_pwd == True:
        password_token = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds))
        return password_token
    else:
        exit()


def check_pwd(password: str) -> bool:

    return True

