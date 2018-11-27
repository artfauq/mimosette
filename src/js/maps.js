/* eslint-disable no-unused-vars */
/* global google */

function loadMap() {
  const myLatLng = {
    lat: 47.018927,
    lng: -2.245554
  };

  const map = new google.maps.Map(document.getElementById('maps'), {
    zoom: 11,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  return new google.maps.Marker({
    position: myLatLng,
    map
  });
}
