//import formatData from 'bubbles.js';

var search_form = document.getElementById('search-form');
var input_field = document.getElementById('input-field');
var temp_array=[];
var comMap = new Map();

//search_form.addEventListener('submit', e => {defaults(e)});
//search_form.addEventListener('submit', (e) => {apicall(e)});
search_form.addEventListener('submit', (e) => {
  comMap.clear();
  var tab = document.getElementById('sub-table')
  if (tab) document.getElementById('contain').removeChild(tab);
  var oldsvg = document.getElementById('main-svg');
  console.log(oldsvg);
  if (oldsvg) document.getElementById('chart').removeChild(oldsvg);
  console.log(oldsvg);
  loading();
  apicall2(e);

});

function comments_array(j){

  //console.log(j.data.children[5])
  for (var v in j.data.children) {
    console.log(j.data.children[v].data.body);
  }

}
function apicall(e,after){
  e.preventDefault();
  var after;
  var search_term = input_field.value;
  var count = 0;
  list=[];
  fetch("https://www.reddit.com/user/"+search_term+"/overview.json?limit=100")
    .then(r => r.json())
    .then(j => {
      temp_array = j.data.children;
      temp_array.forEach(e => {list.push(e.data.subreddit)});
      if (list.length < 100) console.log(list);
      else {
        while (temp_array.length >= 100 && count < 10) {
          after = temp_array[99].data.name;
          console.log(after);
          fetch("https://www.reddit.com/user/"+search_term+"/overview.json?limit=100&after="+after)
            .then(r => r.json())
            .then(j => {
              console.log("In second then");
              temp_array = j.data.children;
              temp_array.forEach(e => {list.push(e.data.subreddit)});
            });
            count += 1;
        }
        console.log(list.length)
        console.log(list);
      }
    });
}
function defaults(e) {
  e.preventDefault();
  var search_term = input_field.value;
  //fetch('http://www.reddit.com/search?q='+search_term)
  fetch("https://www.reddit.com/user/"+search_term+"/comments.json")
    .then(r => r.json())
    .then(r => {
      console.log(JSON.stringify(r, null, 2));
      //comments_array(r);
    });
}

function apicall2(e,after="") {
  e.preventDefault();
  var search_term = input_field.value;
  fetch("https://www.reddit.com/user/"+search_term+"/overview.json?limit=100&after="+after)
    .then(r => r.json())
    .then(j => {
      if (j.data == null) {
        doneLoad();
        alert("User not found. Try again");
        return 1;
      }
      temp_array = j.data.children;
      temp_array.forEach(e => {
        if (comMap.has(e.data.subreddit)) {
          var count = comMap.get(e.data.subreddit);
          comMap.set(e.data.subreddit, count+1);
        }
        else {
          comMap.set(e.data.subreddit, 1);
        }
      });
      if (temp_array.length < 100) {
        console.log(comMap);
        callback();
      }
      else {
        apicall2(e, temp_array[99].data.name);
      }
    });
}

function callback() {
  var t = make_table(comMap);
  t.id = 'sub-table';
  doneLoad();
  //document.getElementById("contain").appendChild(t);
  formatData();
}

function loading() {
  document.body.style.overflow = "hidden";
  document.getElementById("table-head").style.display = "none";
  document.getElementById("load-container").style.display = "inline-block";
  document.getElementById("load-circle").style.display = "inline-block";
  document.getElementById("table-div").style.display = "none";
  document.getElementById("contain2").style.display = "none";
  document.getElementById("table-div2").style.display = "none";
  document.getElementById("contain2").style.display = "none";

}

function doneLoad() {
  document.body.style.overflow = "auto";
  document.getElementById("table-div").style.display = "none";
  document.getElementById("load-circle").style.display = "none";
  document.getElementById("table-head").style.display = "none";
  document.getElementById("table-div").style.display = "none";
  // Force animation fadein
  document.getElementById("table-div").style.display = "block";
  document.getElementById("table-div").style.border = "10px solid #FF5700";
  document.getElementById("table-div").style.borderRadius = "10px";
}


function make_table(m) {

  var t = document.createElement("TABLE");

  var head1 = document.createElement('th');
  head1.innerHTML = "<b>Subreddit</b>";
  var head2 = document.createElement('th');
  head2.innerHTML = "<b>Count</b>";

  t.appendChild(head1);
  t.appendChild(head2);

  for (var [k,v] of m.entries()) {
    var row = t.insertRow(0);
    var c1 = row.insertCell(0);
    c1.innerHTML = k;
    var c2 = row.insertCell(1);
    c2.innerHTML = v;
  }
  return t;

}
