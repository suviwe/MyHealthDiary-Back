# Yksilöprojekti Suvi Westerberg  MyHealthDiary


## komentoja hauille, testattu Postmanilla
### Käyttäjän rekisteröinti
POST http://localhost:3000/api/users/
lisää kenttään esim
{
  "username": "testikayttaja",
  "email": "testaus@example.com",
  "password": "testisalasana"
}

### Kirjaudu sisään
POST http://localhost:3000/api/users/login
{
  "username": "testikayttaja",
  "password": "testisalasana"
}

saat tokenin, kopioi se ja katso omat tiedot:
### Katso omat tietosi
GET http://localhost:3000/api/users/me
Authorization Bearer <your token>


### Lisätty tilastojen (uni, askeleet, juotu vedenmäärä) haku diaryentriesille

#### testikoodit postmanilla
 POST http://localhost:3000/api/diary
 Authorization Bearer  <token>
 GET  http://localhost:3000/api/diary
 GET  http://localhost:3000/api/diary/1 (yksittäisen merkinnän hakeminen)
 PUT http://localhost:3000/api/diary/1
 DELETE http://localhost:3000/api/diary/1
 GET http://localhost:3000/api/diary/stats/sleep

 POST http://localhost:3000/api/activity
 GET http://localhost:3000/api/activity
 PUT http://localhost:3000/api/activity/1


## Kuvakaappaukset


### Etusivu
![Etusivu](images/etusivu.png)

### Kirjautuminen
![Kirjautuminen](images/kirjaudu.png)

### Rekisteröityminen
![Rekisteröityminen](images/rekisteroidy.png)

### Omat sivut
![Omat sivut](images/omat-sivut.png)

### Päiväkirja
![Päiväkirja](images/paivakirja.png)

### Päiväkirjan tilastot
![Päiväkirjan tilastot](images/paivakirja-stats.png)

### Päiväkirjamerkintä
![Päiväkirjamerkintä](images/paivakirjamerkinta.png)

### Kuukautiskierto
![Kuukautiskierto](images/kuukautiskierto.png)

### Kuukautiskierron tilastot
![Kuukautiskierron tilastot](images/kuukautiskierto-stats.png)

### BMI-laskuri
![BMI-laskuri](images/bmi.png)

### Yhteystiedot
![Yhteystiedot](images/yhteystiedot.png)





