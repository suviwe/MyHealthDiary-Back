# Yksilöprojekti Suvi Westerberg  MyHealthDiary


## komentoja hauille, testattu Postmanilla
### Käyttäjän rekisteröinti
POST http://localhost:3000/api/users/
lisää kenttään esim
{
  "username": "updateduser",
  "email": "updateduser@example.com",
  "password": "newsecurepassword"
}

### Kirjaudu sisään
POST http://localhost:3000/api/users/login
{
  "username": "updateduser",
  "password": "newsecurepassword"
}

saat tokenin, kopioi se ja katso omat tiedot:
### Katso omat tietosi
GET http://localhost:3000/api/users/me
Authorization Bearer <your token>




