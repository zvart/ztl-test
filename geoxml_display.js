ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [41.893917, 12.507459],
            zoom: 6
        }, {
            searchControlProvider: 'yandex#search'
        }),
        //--> из kml
                gpxButton = $('.load-gpx'),
        kmlButton = $('.load-kml'),
        kmlFlightsButton = $('.load-kml-flights'),
        //<-- из kml
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 150,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);


    $.ajax({
        url: "data.json"
    }).done(function(data) {
        objectManager.add(data);
    });

        //--> из kml

    // Отключение кеширования атрибута disabled в Firefox.
    gpxButton.get(0).disabled = false;
    kmlButton.get(0).disabled = false;
    kmlFlightsButton.get(0).disabled = false;
    
    
        // При нажатии на кнопку загружаем соответствующий XML-файл
    // и отображаем его данные на карте.
    gpxButton.click(function (e) {
        ymaps.geoXml.load('geoObjects.gpx')
            .then(onGeoXmlLoad);
        e.target.disabled = true;
    });
    kmlButton.click(function (e) {
        ymaps.geoXml.load('ZTL.kml')
            .then(onGeoXmlLoad);
        e.target.disabled = true;
    });
    kmlFlightsButton.click(function (e) {
        ymaps.geoXml.load('http://openflights.org/demo/openflights-sample.kml')
            .then(function (res) {
                res.geoObjects.each(function (obj) {
                    obj.options.set({preset: 'islands#blackCircleIcon'});
                    if (!obj.geometry) {
                        obj.each(function (obj) {
                            obj.options.set({strokeColor: "9090e8"});
                        });
                    }
                });
                onGeoXmlLoad(res);
            });
        e.target.disabled = true;
    });

    // Обработчик загрузки XML-файлов.
    function onGeoXmlLoad(res) {
        myMap.geoObjects.add(res.geoObjects);
        if (res.mapState) {
            res.mapState.applyToMap(myMap);
        }
        else {
            myMap.setBounds(res.geoObjects.getBounds());
        }
    }
          //<-- из kml
    

}
