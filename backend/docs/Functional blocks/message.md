#### Весь функционал 
- [x] Отправка
- [x] Удаление
- [ ] Изменение
- [x] Получение сообщения
#### Общие проверки:
1. **Авторизован ли пользователь?** (401)
2. **Есть ли ключ сессии?** (401)

#### 1. Отправка сообщения (шифрование)
###### POST /message
- BODY: {chatID, value}
- STATUS 201,400,401,403,404,500
###### проверки:
3. Существуют ли данные? (400)
4. Существует ли чат? (404)
5. Отправитель есть в этом чате? (403)
###### Процесс:
1. Запись данных сообщения
2. Шифрование ключом чата
###### SERVER:message => *room(chatID)*
- DATA: {message}

#### 2. Удаление сообщения
###### GET /message/:message_id/remove
- STATUS: 201,400,401,403,404,500
###### проверки:
3. Существуют ли данные? (400)
4. Существует ли сообщение? (404)
5. Не должно быть системным (403)
6. Отправитель его автор? (403)

Процесс:
1. Удаление записи сообщения
###### SERVER:message/remove => room(chatID)
- DATA: {messageID}

#### 3. Изменение сообщений (шифрование)
###### POST /message/:message_id/edit
- BODY: {value}
- STATUS 201,400,401,403,404,500
###### Проверки:
3. Существуют ли данные? (400)
4. Существует ли сообщение? (404)
5. Не должно быть системным (403)
6. Отправитель его автор? (403)
###### Процесс:
1. Изменение данных в базе и добавление даты изменения
###### SERVER:message/edit => *room(chatID)*
- DATA: {message}

#### 5. Получение сообщения (шифрование)
###### GET /message/:message_id
- RESPONSE: {message}
- STATUS 201,400,401,403,404,500
###### проверки:
3. Существуют ли данные? (400)
4. Существует ли сообщение? (404)
5. Отправитель - участник чата, в котором это сообщение?
###### Процесс:
1. Получение записи из базы