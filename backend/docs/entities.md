### USER

    - id
    - name
    - email
    - tag
    - createdAt
    - enteredAt
    - activated

### PASSWORD

    - id
    - user_id
    - value

### USER_AVATAR

    - id
    - user_id
    - path
    - uploadedAt

### SESSION

    - id
    - cookie
    	- expires
    	- ...
    - user_id
    - key

### SOCKET_SESSION

    - id
    - cookie
    	- expires
    	- ...
    - user_id
    - session_id

### CHAT

    - id
    - is_private
    - title
    - avatar_id
    - creator_id
    - key

### CHAT_AVATAR

    - id
    - chat_id
    - path

### CHAT_MEMBER

    - id
    - chat_id
    - user_id
    - last_seen
    - invitedAt
    - invitedBy

### MESSAGE

    - id
    - system
    - user_id
    - chat_id
    - sentAt
    - editAt
    - value
