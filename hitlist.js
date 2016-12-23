/**
 * 
 * Assuming you are using Angular for this assignment, you need to define
 * the app and controller here. 
 *
 **/

var app = angular.module('hitlistApp', []);
var searchQuery;
var docs;
var items;
var title;
var description;
var sDate;
var eDate;
var videoId;
var videoUrl;
var finalresults = [];
var links = [];
var nonrepeatedlinks = [];

app.controller('hitlistCtrl', function($scope) {
    $scope.query= "Search";
});

function processData(data) {
        docs = data.response.docs;
        var k=0;
        for (i = 0; i < docs.length; i++) {
       		links[i]=docs[i].videoId;
        }
        $.each(links, function(i, elem){
    		if($.inArray(elem, nonrepeatedlinks) === -1){ 
    			nonrepeatedlinks.push(elem);
    			finalresults.push(docs[i]);
    		}
		});
		docs = finalresults;
		finalresults = [];

        $.each(docs, function(i, item) {
        	var j=0;
        	sDate = $('#startDate').val();
        	eDate = $('#endDate').val();
        	if(sDate.toString().localeCompare(eDate.toString())>0){
        		alert("Start date is later than end date!");
        		/**$('#defaultContent').css("display", "block");
				$('#video').css("display", "none");**/
        		return false;
        	}
        	if(sDate.toString().localeCompare(item.date.toString())<1 && eDate.toString().localeCompare(item.date.toString())>-1){
            	finalresults.push(item);
   			}
        });

        docs = finalresults;
        var temp;
        for (i = 0; i < docs.length; i++) {
        	for (j = 0; j < docs.length; j++) {
        		if(docs[i].position < docs[j].position){
        			temp = docs[i];
        			docs[i] = docs[j];
        			docs[j] = temp;
        		} else if(docs[i].position == docs[j].position){
        			if(docs[i].date.toString().localeCompare(docs[j].date.toString())<0){
						temp = docs[i];
        				docs[i] = docs[j];
        				docs[j] = temp;
        			}
        		}
        	}
        }
        
        
        var descrWords = [];
        finalresults = [];
        var ok;
        if($('#descriptionQuery').val()!=0){
        	descrWords = $('#descriptionQuery').val().split(' ');
        	for (i = 0; i < docs.length; i++){
        		ok = true;
        		for(j = 0; j < descrWords.length; j++){
        			if(docs[i].description.toLowerCase().indexOf(descrWords[j].toLowerCase())==-1){
        				ok = false;
        			}
        		}
        		if(ok == true){
        			finalresults.push(docs[i]);
        		}
        	}
        	docs = finalresults;
        }

        console.log("start date: " + sDate);

        for (i = 0; i < docs.length; i++){
        	$('#olist').prepend($('<li onclick="playVideo()"><img src="' + docs[i].thumbUrl +'" alt="Icon"/></image>' + docs[i].title + '</li>'));
        	console.log("video date: " + docs[i].date);
        	console.log("position" + docs[i].position);
        }

        console.log("end date: " + eDate);

        var total = 'Found ' + docs.length + ' results';
        $('#foundlist').append(total);
}

function submitSearch() {
	document.getElementById("videolist").innerHTML = '<ol id="olist"></ol><li id = "foundlist"></li>';
    docs = [];
    finalresults = [];
    links = [];
    nonrepeatedlinks = [];
    $('#defaultContent').css("display", "block");
	$('#video').css("display", "none");
    searchQuery = $('#query').val();
    if (searchQuery.length == 0 || $('#startDate').val()==0 || $('#endDate').val()==0) {
    	alert("Improper input!");
    	/**$('#defaultContent').css("display", "block");
		$('#video').css("display", "none");**/
        return;
    }
    var url = 'http://localhost:8983/solr/hitlist/select?indent=on&q=' + searchQuery +'&wt=json&callback=?&json.wrf=processData';
    $.getJSON(url);
}

function playVideo(){
	$('#olist').on('click','li',function (){
    	title = $(this).text();
    	for (i = 0; i < docs.length; i++) {
    		if(docs[i].title == title){
    			description = docs[i].description;
    			videoId = docs[i].videoId;
    			i=docs.length;
    		}
		}
		document.getElementById("videotitle").innerHTML = title;
		document.getElementById("description").innerHTML = description;
		videoUrl = 'https://www.youtube.com/embed/' + videoId;
		document.getElementById('iframe').src = videoUrl;
	});
	

	$('#defaultContent').css("display", "none");
	$('#video').css("display", "block");
}