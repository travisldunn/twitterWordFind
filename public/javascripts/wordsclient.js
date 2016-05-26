window.addEventListener("load", function() {


		var searchField = document.getElementById("searchWord");
		var searchList = document.getElementById("wordlist");

		var countField = document.getElementById("countWord");
		var countDisplay = document.getElementById("displayCount");
		var resultDIV = document.getElementById("resutl3");
		var deleteWord = document.getElementById("delWord");
		var update = document.getElementById("updateWord");
		var create = document.getElementById("createWord");
		var updateText = document.getElementById("updateText");
		var updateTextword = document.getElementById("word");
		var wordselected = searchField.value;
		console.log(updateTextword);

		var searchResult = [];


		updateText.setAttribute("value", wordselected);



		create.addEventListener("click", function() {
			console.log("in create button eventlistener");

			var abbrev = searchField.value;
			var xhr = new XMLHttpRequest();
			var uri = "/wordsapi/v3/create/" + abbrev;
			console.log(uri);
			xhr.open("POST", uri);
			xhr.setRequestHeader("Content-Type", "application/json");


			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var result = xhr.response;
					console.log("result" + result + xhr.response.id);
					console.log(result);
						var p1 = document.createElement("p");
						p1.innerHTML = "ID :" + result.id + " Word :" + result.word;
						resultDIV.appendChild(p1);

				}

			};

			xhr.responseType = 'json';
			xhr.send(null);
		});



		deleteWord.addEventListener("click", function() {
			console.log("in delete button eventlistener");

			var abbrev = searchField.value;
			var idTest = searchList.value;
			var xhr = new XMLHttpRequest();
			var uri = "/wordsapi/v3/delete/" + idTest + "/" + abbrev;
			console.log(uri);
			xhr.open("DELETE", uri);

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					var result = xhr.response;
					console.log(result);
					console.log("result " + xhr.response.statusText);

				}

			};

			xhr.responseType = 'json';
			xhr.send(null);
		});

		update.addEventListener("click", function() {
			console.log("in update button eventlistener");

			var wordJSON =   {};
			wordJSON.word =updateTextword.value;
			wordJSON.word1 =searchList.options[searchList.selectedIndex].label;
			console.log("updated word is : " + wordJSON.word + " and old is" +wordJSON.word1);
			var idTest = updateText.value;
			var xhr = new XMLHttpRequest();
			var uriupdate = "/wordsapi/v3/update/" + idTest;
			console.log(uriupdate);
			xhr.open("PUT", uriupdate);
			xhr.setRequestHeader("Content-type", "application/json");

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					var result = xhr.response;
					console.log("response from server route is" +result + result.word );
					var p1 = document.createElement("p");
						p1.innerHTML = "Updated word : " + result.word  + " with word: " + result.word1;
						resultDIV.appendChild(p1);
				}

			};

			xhr.responseType = 'json';
			xhr.send(JSON.stringify(wordJSON));
		});


		searchField.addEventListener("keyup", function(evt) {

			var abbrev = searchField.value;

			var caseSensitive = document.getElementById("case2");
			// console.log(caseSensitive.checked + " and key pressed is : " + evt.keyCode);
			// console.log("abbrev" + abbrev);
			var xhr = new XMLHttpRequest();



			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					searchList.innerHTML = "";
					for (var i = 0; i < 100; i++) {
						var opt = document.createElement("option");

						searchResult = xhr.response;
						// console.log(i);
						opt.value = xhr.response[i].id;
						opt.label = xhr.response[i].word;
						opt.innerHTML = xhr.response[i].word;
						searchList.appendChild(opt);
					}
				}
			};
			var uri = "/wordsapi/v3/search/" + abbrev + "?case=" + caseSensitive.checked;

			var thresh = searchField.dataset.threshold;
			if (thresh && Number(thresh) > 0) {
				uri += "&threshold=" + Number(thresh);
			}
			xhr.open("GET", uri);
			xhr.responseType = 'json';
			xhr.send();



		});
	

			searchList.addEventListener("change", function() {

					var abbrev = searchList.options[searchList.selectedIndex].text;
				var  idTest = searchList.value;

		updateTextword.value= abbrev;
		 updateText.value = idTest;

		console.log("in function value  to update innerHTML while searching " +idTest);

		var xhr = new XMLHttpRequest();

				var uri = "/wordsapi/v3/find/" + idTest;
				console.log(uri);
				xhr.open("GET", uri);
				//xhr.setRequestHeader("Content-Type", "application/json");

				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200) {
						var result = (xhr.response);

						console.log(result);
						var p1 = document.createElement("p");
						p1.innerHTML = "ID :" + result.id + " Word :" + result.word;
						resultDIV.appendChild(p1);

						showtweet(result.twitter);

					}
					console.log(uri);
				};

				xhr.responseType = 'json';
				xhr.send(null);
			searchField.value = searchList.options[searchList.selectedIndex].label;
	
});

function showtweet(twitter)
{

twitterList = twitter.statuses;
console.log("twitter List size :" + twitterList.length);
for(var i =0; i <twitterList.length; i++)
{
	console.log("tweet # " + i + " " +twitterList.source);
	var p2 = document.createElement("p");
	p2.innerHTML = "tweet # " + i + " " +twitterList[i].text;
	resultDIV.appendChild(p2);

}


}			

});