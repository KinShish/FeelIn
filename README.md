# FeelIn
Разработка программного решения конвертации видео в текст для рекомендательной системы
# Использование
<br>1.Нажмите кнопку загрузки или выберите нужный Вам файл видео или перетащите ваш файл в окно загрузки программы FeelIn.
<br>![owl](https://user-images.githubusercontent.com/75037261/144620462-1537580d-49c3-460e-98cc-fb17cf739c52.PNG)<br>
<br><br>
2.Подождите пока система "FeelIn" переконвертирует видеоматериалы. После недолгого ожидания вас перекинет на страницу с уже обработанными файлами, где у вас откроется возможность "просмотреть" готовые решения обработки видео, а также выгрузить перечисленные данные в json-файле!![Owl 2](https://user-images.githubusercontent.com/75037261/144598322-f499e7f2-cf47-4c91-94e1-bcdcbd87d4a0.PNG)
<br><br>
3.Вы можете всегда вернуться к началу,нажав кнопку "Загрузить еще".Также вверху у вас появится кнопка история загрузок, где вы сможете просмотреть все обработанные файлы!
<br>![owl5](https://user-images.githubusercontent.com/75037261/144600858-4c4f07ef-a9a6-4c84-bdc8-78a2f70110e9.PNG)<br>
<br><br>
4.Если вы нажмете на кнопку "Просмотреть" у вас откроется модальное окно с набором вкладок, первая из которых "распознанный текст"
<br>![текст](https://user-images.githubusercontent.com/75037261/144616612-aa1bb7eb-2812-4edf-8e1a-d9816a34a19c.PNG)<br>
<br><br>
5.Далее идет вкладка с уже очищенным текстом от лишнего звукового мусора.
<br>![text5](https://user-images.githubusercontent.com/75037261/144617407-16260346-8ec2-48e0-92ab-ea92353490e2.PNG)<br>
<br><br>
6.Вкладка "Текст с временными рамками" 
![текст2](https://user-images.githubusercontent.com/75037261/144621660-1ba7a78b-8313-4618-a657-e5587c294073.PNG)
<br><br>
# Установка
**BackEnd**

Скопировать репозиторий

Для работы проекта также нужно скачать модель vosk по ссылке https://alphacephei.com/vosk/models

и разархивировать ее в папку `api/modal`

Выполнить

```
    cd api<br>
    npm i<br>
    node index.js<br>
```
Запуститься API и в консоли будет указано к какому IP подключаться<br>


**FrontEnd**<br>
Скопировать репозиторий<br>
Выполнить<br>
```
    cd feeling_frontend
    npm i
    npm run serve
```    
Запустится web server и в консоле будет указано на каком пути он работает
# Создано с помощью
Node.js <br>
Vue.js <br>
Phyton <br>
# Авторы
Backend Борис Шишкин<br>
Frontend Дмитрий Прохач<br>
Pr-manager Мария Климова<br>
Product-manager Оксана Терещенко<br>
Design Анастасия Глинская
# Благодарности
Спасибо всем,кто сделал свой вклад в создание такого сервиса как FeelIn!<br>
А также большое спасибо цифровому прорыву за интересные кейсы, за вдохновение, мотивацию и возможность пробовать себя!
