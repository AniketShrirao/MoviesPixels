//pageNo for passing in url & numbers for storing fibbonaci series
let pageNo,
  numbers = [],
  postdata;
//seeting url
window.location.assign = "/index.html?pageNo=" + pageNo;
//getting exact no. from url. used split since there is only one parameter
let valueOfPageNo = location.search.split("=")[1];
//url for post api and photo api
const postUrl = "https://jsonplaceholder.typicode.com/posts";
const photoUrl = "https://jsonplaceholder.typicode.com/photos";
//container to display posts
let postsContainer = document.querySelector(".posts");

//fetching 1st api post api
const posts = fetch(postUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
			errorFunction();
    }
  })
  .then(data => {
		//storing 1st api data
		postdata = data;
  })
  .catch(error => {	errorFunction();});

//2nd api photo api
const photo = fetch(photoUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
			errorFunction();
    }
  })
  .then(data => {
    //function to display data
    displayData(data);
  })
  .catch(error => {
		errorFunction();
	});

// function to calculate fibonnaci series
const fibbonaciSeriesTerm = () => {
  let first = 0,
    second = 1,
    sum = 1;
  for (let i = 0; i <= 100; i++) {
    sum = first + second;
    first = second;
		second = sum;
		//storing fibbonaci series in an array
    numbers.push(sum);
  }

  //directly returning the exact number of post which we get from pageNO and fibonaci series
  return numbers[valueOfPageNo];
};

const displayData = data => {
 
	let fibNum = fibbonaciSeriesTerm();
	let temp_Id = [],Id;
	//storing id's from data
	for(let i =0;i<postdata.length;i++) {
		temp_Id.push( postdata[i].userId);
	}
		//removing dupicate values of id from data 
	 Id = [...new Set(temp_Id)];
	//displaying post

	 for (let i = 0; i <10; i++) {
    let id = postdata[i].userId;
 
      for (let j = 0; j < fibNum; j++) {
        let post = CreateElement("div", "post");
        let userid = CreateElement("span", "userid");
        let title = CreateElement("p", "title");
        let postBody = CreateElement("p", "postBody");
        let img;
        userid.innerHTML = "UserId : " + Id[i];
        title.innerHTML = "Title : " + postdata[j].title;
        postBody.innerHTML = "Body : " + postdata[j].body;

        appendElement(post, userid);
        appendElement(post, title);
        appendElement(post, postBody);
        appendElement(postsContainer, post);
				//checking id is even or odd and adding images accrodingly
        if (id % 2 === 0) {
          for (let k = 0; k < 3; k++) {
            img = createImg(data[i].url);
            appendElement(post, img);
          }
        } else {
          for (let k = 0; k < 2; k++) {
            img = createImg(data[i].url);
            appendElement(post, img);
          }
        }
      }
  }
};

// creat methods
const CreateElement = (elem, className) => {
  let element = document.createElement(elem);
  element.classList.add(className);
  return element;
};

const createImg = url => {
  let imgelement = document.createElement("img");
  imgelement.setAttribute("src", url);
  return imgelement;
};

const appendElement = (parent, child) => {
  parent.appendChild(child);
};

const errorFunction = () => {
	window.Location(error.html);
}