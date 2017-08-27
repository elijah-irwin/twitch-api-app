// array of intial streamers to be loaded and presented to the user
var streams = ['shroud', 'Bajheera', 'FreeCodeCamp', 'loltyler1', 'lost_in_house', 'witwix'];

// takes params page type & streamer name, returns string twitch api url for json call
function url(page, name) {
  return "https://wind-bow.gomix.me/twitch-api/" + page + "/" + name + "?callback=?";
}

// makes 2 json calls to twitch api's, gathers and presents streamer information
function getData() {
  streams.forEach(function(stream) {
    var sURL = url("streams", stream);
    var cURL = url("channels", stream);
    
    $.getJSON(sURL, function(data) {
      var isLive, status, viewers;
      if(data.stream) { isLive = true; status = "Online"; viewers = String(data.stream.viewers); } 
      else { isLive = false; status = "Offline"; }
      
      $.getJSON(cURL, function(data) {
        var logo = data.logo;
        var name = data.display_name;
        var desc = data.status;
        var game = data.game;
        var url = data.url;
        
        if(isLive) {
          $(".content").append(
            "<div class='stream online'>" +
              "<table width='800px'>" +
                "<tr>" +
                  "<td width='160px'><img id='logo' src=" + logo + "></img></td>" +
                  "<td width='160px'><a id='onName' href=" + url + ">" + name + "</a></td>" +
                  "<td width='160px'><span id='game'>Playing:<br>" + game + "</span></td>" +
                  "<td width='160px'><span id='viewers'>" +
                    "<span><i class='fa fa-user-o' aria-hidden='true'></i> " + 
                     viewers + "</span>" +
                  "</td>" +
                  "<td width='160'>" +
                    "<span class='delete'>" + 
                      "<i class='fa fa-trash-o' aria-hidden='true'></i>" + 
                    "</span>" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</div>");
        } else {
          $(".content").append(
            "<div class='stream offline'>" +
              "<table width='800px'>" +
                "<tr>" +
                  "<td width='160px'><img id='logo' src=" + logo + "></img></td>" +
                  "<td width='160px'><span id='offName'>" + name + "</span></td>" +
                  "<td width='160px'><span id='game'>Status:<br>Offline</span></td>" +
                  "<td width='160px'><span id='viewers'>" +
                    "<span><i class='fa fa-user-o' aria-hidden='true'></i> 0</span>" +
                  "</td>" +
                  "<td width='160px'>" +
                    "<span class='delete'>" +
                      "<i class='fa fa-trash-o' aria-hidden='true'></i>" +
                    "</span>" +
                  "</td>" +
                "</tr>" +
              "</table>" +
            "</div>");  
        }
      });
    });
  });
}

// pretty much the same as getData but it doesn't loop through the entire array again,
// it just calls the api for the specific streamer param from input 
function addNewStreamer(streamer) {
  var sURL = url("streams", streamer);
  var cURL = url("channels", streamer);

  $.getJSON(sURL, function(data) {
    var isLive, status, viewers;
    if(data.stream) { isLive = true; status = "Online"; viewers = String(data.stream.viewers); } 
    else { isLive = false; status = "Offline"; }

    $.getJSON(cURL, function(data) {
      console.log(data);
      if(data.error) {
        alert("Your search was invalid. Make sure their name is spelt correctly!");
        return 0;
      }
      
      if(data.logo) var logo = data.logo;
      else var logo = "http://www.ckconsumables.com/Content/Images/no_image_placeholder.png";
      var name = data.display_name;
      var desc = data.status;
      var game = data.game;
      var url = data.url;

      if(isLive) {
        $(".content").append(
          "<div class='stream online'>" +
          "<table width='800px'>" +
          "<tr>" +
          "<td width='160px'><img id='logo' src=" + logo + "></img></td>" +
          "<td width='160px'><a id='onName' href=" + url + ">" + name + "</a></td>" +
          "<td width='160px'><span id='game'>Playing:<br>" + game + "</span></td>" +
          "<td width='160px'><span id='viewers'>" +
          "<span><i class='fa fa-user-o' aria-hidden='true'></i> " + 
          viewers + "</span>" +
          "</td>" +
          "<td width='160'>" +
          "<span class='delete'>" + 
          "<i class='fa fa-trash-o' aria-hidden='true'></i>" + 
          "</span>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "</div>");
      } else {
        $(".content").append(
          "<div class='stream offline'>" +
          "<table width='800px'>" +
          "<tr>" +
          "<td width='160px'><img id='logo' src=" + logo + "></img></td>" +
          "<td width='160px'><span id='offName'>" + name + "</span></td>" +
          "<td width='160px'><span id='game'>Status:<br>Offline</span></td>" +
          "<td width='160px'><span id='viewers'>" +
          "<span><i class='fa fa-user-o' aria-hidden='true'></i> 0</span>" +
          "</td>" +
          "<td width='160px'>" +
          "<span class='delete'>" +
          "<i class='fa fa-trash-o' aria-hidden='true'></i>" +
          "</span>" +
          "</td>" +
          "</tr>" +
          "</table>" +
          "</div>");  
      }
    });
  }); 
}

// shows online / hides offline streams by adding/removing classes
function showOnline() {
  $(".offline").css("display", "none");
  $(".online").css("display", "");
  $("#all").removeClass("active");
  $("#offline").removeClass("active");
  $("#online").addClass("active");
}
function showOffline() {
  $(".online").css("display", "none");
  $(".offline").css("display", "");
  $("#all").removeClass("active");
  $("#online").removeClass("active");
  $("#offline").addClass("active");
}
function showAll() {
  $(".online").css("display", "");
  $(".offline").css("display", "");
  $("#offline").removeClass("active");
  $("#online").removeClass("active");
  $("#all").addClass("active");
}

// main 
$(document).ready(function() {
  // initial call for data
  getData();
  
  // listeners for online/offline/all buttons
  $("#online").click(function() { showOnline(); });
  $("#offline").click(function() { showOffline(); });
  $("#all").click(function() { showAll(); });
  
  // listener for delete button, removes specific streamer
  $(document).on("click", ".delete", function() {
    $(this).closest("div").fadeOut("slow", function() {
      $(this).remove();
    });
  });
  
  // listener for search button, calls addNewStreamer function with param streamer from input
  $(".addStreamer").click(function() {
    var streamer = $("input").val();
    addNewStreamer(streamer);
    $("input").val("");
  })
});