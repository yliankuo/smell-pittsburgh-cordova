﻿var MapPage = {


  initialize: function () {
    console.log("refreshing iframe");
    $('#iframe-map').attr('src', $('#iframe-map').attr('src'));
    
    if (LocalStorage.get("firsttime_map")) {
      MapPage.showMapModal();
      LocalStorage.set("firsttime_map",false);
    }
  },


  onDeviceReady: function() {
    console.log("Mappage.onDeviceReady");
  },


  // helper functions


  showMapModal: function() {
    $("#modal-map-firsttime").popup();
    $("#modal-map-firsttime").popup("open");
  },

}