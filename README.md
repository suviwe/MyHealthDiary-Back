# Yksilöprojekti Suvi Westerberg  MyHealthDiary

Tämä on MyHealthDiary-sovelluksen backend. Sovellus auttaa käyttäjiä seuraamaan hyvinvointiaan päiväkirjamerkinnöillä ja tilastoilla.

## Linkit
- **Sovellus (Front-end)**: [http://localhost:5173](http://localhost:5173)
- **API (Back-end)**: [http://localhost:3000](http://localhost:3000)
- **API-dokumentaatio (Apidoc)**: [http://localhost:3000/api](http://localhost:3000/api)

## Tietokantakaavio
Alla on sovelluksen tietokantakaavion kuvaan linkkki
![Tietokantakaavio](images/tietokanta.png)



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
![Päiväkirjamerkintä](images/paivakirjamerkinnat.png)

### Kuukautiskierto
![Kuukautiskierto](images/kuukautiskierto-etusivu.png)

### Kuukautiskierron tilastot
![Kuukautiskierron tilastot](images/kuukautiskalenterin-ominaisuudet.png)

### BMI-laskuri
![BMI-laskuri](images/bmi.png)

### Yhteystiedot
![Yhteystiedot](images/yhteystiedot.png)





