import bcrypt

def hash_pwd(password: str, rounds = 12) -> bytes:
    valid_pwd = check_pwd(password)

    if valid_pwd == True:
        password_token = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds))
        return password_token
    else:
        exit()


def check_pwd(password: str) -> bool:
    #Password must contain at least 8 characters 
    if len(password) < 8:
        print("Password must contain at least 8 characters")
        return False
    elif password.count(" "):
        print("Password cannot contain spaces")
        return False
    elif count_digits(password) < 1:
        print("Password must contain at least one digit")
        return False
    elif count_special(password) < 1:
        print("Password must contain at least one special character")
        return False
    else:
        return True
    
def count_digits(password: str) -> int:
    count = 0

    for index in password:
        if index.isdigit():
            count += 1

    return count

def count_special(password: str) -> int:
    count = 0

    for index in password:
        if not index.isalnum():
            count += 1

    print(count)
    return count

pwd = hash_pwd("thisisatest2*")
print(pwd)
