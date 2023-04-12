import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, serverTimestamp, getCountFromServer ,onSnapshot, orderBy, writeBatch, doc, deleteDoc, connectFirestoreEmulator, query, where, setDoc, runTransaction } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import emailjs from '@emailjs/browser';
import { read, writeFileXLSX } from "xlsx";
import XLSX from 'xlsx';

const firebaseConfig = {
  apiKey: "AIzaSyD-yeq21RPZFZIYhecLaTh1OPkCuM0Z2ms",
  authDomain: "jackleckerman-70b9f.firebaseapp.com",
  projectId: "jackleckerman-70b9f",
  storageBucket: "jackleckerman-70b9f.appspot.com",
  messagingSenderId: "1070046232390",
  appId: "1:1070046232390:web:f52b183eb70fcad3a92f47",
  measurementId: "G-ZW770153Y5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

let form = document.querySelector("#form");
let fname = document.querySelector('#fsname');
let lname = document.querySelector('#scname');
let email = document.querySelector('#email');
let coordBtn = document.querySelector('#add-coord-btn');
let errorOne = document.querySelector('#error-one');
let errorTwo = document.querySelector('#error-two');
let errorThree = document.querySelector('#error-three');

// Password Generator: 

function makepassword(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
// /////////////////////

if (coordBtn) {
  coordBtn.addEventListener('click', async (e) => {


  if (fname.value === '' || fname.value === null ||lname.value === '' || lname.value === null || email.value === '' || email.value === null) {
    if (fname.value === '' || fname.value === null) {

      errorOne.innerHTML = "*First name is required"
    } else {
      errorOne.classList.add("hidden")
    }
  
    if (lname.value === '' || lname.value === null) {
  
      errorTwo.innerHTML = "*Last name is required"
    } else {
      errorTwo.classList.add("hidden")
    }
  
    if (email.value === '' || email.value === null) {
  
      errorThree.innerHTML = "*Email is required"
    } else {
      errorThree.classList.add("hidden")
    }
  } else {
    regPop.classList.add("hidden");
    regPop.classList.remove("block");
    overlay.classList.add("hidden");

    let pass = [];
    pass.push(makepassword(10));

      var params = {
        from_name : `${fname.value} ${lname.value}`,
        email_id: email.value,
        password: pass.toString()
      }
      emailjs.send('service_r39ml1j', 'template_kjtoerl', params, "_oAoi1a5ARfpe6IsI")
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
          console.log('FAILED...', error);
        });

      //MailJet:
      
      /**
 *
 * Run:
 *
 */

      // const myModule = require('node-mailjet');

      // if (myModule) {
      //   console.log('Module imported successfully');
      // } else {
      //   console.log('Module not found');
      // }


      // const Mailjet = require('node-mailjet');

      // const mailjet = Mailjet.apiConnect(
      //   process.env.MJ_APIKEY_PUBLIC,
      //   process.env.MJ_APIKEY_PRIVATE,
      // );
      
      // function sendEmail(recipient) {
      //   return mailjet
      //     .post("send", { version: "v3.1" })
      //     .request({
      //       Messages: [
      //         {
      //           From: {
      //             Email: "shady22elmagic@gmail.com",
      //             Name: "JackLeckerman",
      //           },
      //           To: [
      //             {
      //               Email: email.value,
      //             },
      //           ],
      //           Subject: "one",
      //           TextPart: "two",
      //           HTMLPart: "three",
      //         },
      //       ],
      //     })
      //     .then((result) => {
      //       // do something with the send result or ignore
      //       console.log("done")
      //     })
      //     .catch((err) => {
      //       // handle an error
      //       console.log("error")
      //     });
      // }

      // const api = new MailSlurp({ apiKey: "db682089d96bec6fbce322f0ff2467b9e1ef6f639d663eb4a6de00332dbe2c2c" });
      // const newEmailInbox = await api.createInbox();
      // const result = await sendEmail(newEmailInbox.emailAddress);
      // expect(result.success).to.be(true);

      // **************

    try {
      const docRef = await addDoc(collection(db, "excelSheetMembers"), {
        firstName: fname.value,
        lastName: lname.value,
        email: email.value,
        password: pass.toString(),
        changedPassword: false,
        rank: 1
      });

      // let coordRef = doc(db, "Events", userEventId, "users", docRef.id);
      // setDoc(coordRef, {
      //   name: fname.value,
      //   lastName: lname.value,
      //   isAdmin: true
      // });

      alert("Coordinator Added Successfully")
      location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
});
}



function convertDateTo12HourFormat(dateTime) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const date = new Date(dateTime);
  const monthName = months[date.getMonth()];
  const dayNumber = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const formattedDate = `${monthName}, ${dayNumber}, ${hours}:${minutes} ${amPm}`;
  return formattedDate;
}

// Events : 

let eventBtn = document.querySelector("#add-event-btn");
let eventName = document.querySelector("#eventname");
let eventSelectColor = document.querySelector("#select-event-color");
let eventTableNum = document.querySelector("#table-event-number");
let eventMeetingLength = document.querySelector("#meeting-event-length");
let eventFromDate = document.querySelector("#from-event-date");
let eventToDate = document.querySelector("#to-event-date");
let eventPop = document.querySelector("#event-pop");
let overlay = document.querySelector(".overlay");

let eventErrorOne = document.querySelector("#event-error-one")
let eventErrorTwo = document.querySelector("#event-error-two")
let eventErrorThree = document.querySelector("#event-error-three")
let eventErrorFour = document.querySelector("#event-error-four")
let eventErrorFive = document.querySelector("#event-error-five")
let eventErrorSix = document.querySelector("#event-error-six")

if (eventBtn) {

  let idListOne = [];
  let idListTwo = [];
  let dateListValues = [];
    let addDate = document.querySelector("#add-date-btn");
    if (addDate) {

      var count = 2;
      addDate.addEventListener('click', () => {
        count++;

        if (count>20){
          addDate.disabled = true;
          addDate.classList.add("hidden");
        } else {
          
            let newOpt = document.createElement("div");
            let form = document.querySelector("#form");
            newOpt.classList.add("relative");
            // newOpt.setAttribute("id", `${count}-id`)
    
            newOpt.innerHTML = `

            <div class="relative !my-6">
              <label for="from-event-date-${count}-id" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">From:</label>
              <input type="datetime-local" name="meeting-length" id="from-event-date-${count}-id" class="mt-4 border-black border-2 rounded-full w-full px-4">
            </div>
            

            <div id="event-error-five"></div>
            
            
            <div class="relative !my-6">
              <label for="to-event-date-${count}-id" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">To:</label>
              <input type="datetime-local" name="meeting-length" id="to-event-date-${count}-id" class="mt-4 border-black border-2 rounded-full w-full px-4">
            </div>
            `
            form.appendChild(newOpt);
        }

        let dd = document.querySelector(`#from-event-date-${count}-id`);
        let bb = document.querySelector(`#to-event-date-${count}-id`);
        let ww = dd.getAttribute("id");
        let mm = bb.getAttribute("id");
        // if (dd) {

        //   console.log(dd.value)
        // }

       
        idListOne.push(ww)
        idListTwo.push(mm)

        // dateListValues.push(`From: ${dd.value} To: ${bb.value}`)

        // console.log(dateListValues);

        console.log(idListOne);
        console.log(idListTwo);
        console.log(count);
        
      })
      
      
    }


  eventBtn.addEventListener('click', async (e) => {


  if (eventName.value === '' || eventName.value === null || eventSelectColor.value === '#000000' || eventTableNum.value === '' || eventTableNum.value === null || eventMeetingLength.value === '' || eventMeetingLength.value === null || eventFromDate.value === '' || eventFromDate.value === null || eventToDate.value === '' || eventToDate.value === null) {
    if (eventName.value === '' || eventName.value === null) {

      eventErrorOne.innerHTML = "*Event name is required"
    } else {
      eventErrorOne.classList.add("hidden")
    }
  
    if (eventSelectColor.value === '#000000' || '#003366' || '#008dff' || '#FFFFFF' || '#fff0') {
  
      eventErrorTwo.innerHTML = "*Select Another Color"
    } else {
      eventErrorTwo.classList.add("hidden")
    }

    if (eventTableNum.value === '' || eventTableNum.value === null) {
  
      eventErrorThree.innerHTML = "*Select Number of Tables"
    } else {
      eventErrorThree.classList.add("hidden")
    }

    if (eventMeetingLength.value === '' || eventMeetingLength.value === null) {
  
      eventErrorFour.innerHTML = "*Select Length of Meeting"
    } else {
      eventErrorFour.classList.add("hidden")
    }

    if (eventFromDate.value === '' || eventFromDate.value === null) {
  
      eventErrorFive.innerHTML = "*Select Date & Time"
    } else {
      eventErrorFive.classList.add("hidden")
    }

    if (eventToDate.value === '' || eventToDate.value === null) {
  
      eventErrorSix.innerHTML = "*Select Date & Time"
    } else {
      eventErrorSix.classList.add("hidden")
    }
  } else {
    eventPop.classList.add("hidden");
    eventPop.classList.remove("block");
    overlay.classList.add("hidden");

  


    dateListValues.push(`From: ${convertDateTo12HourFormat(eventFromDate.value)}, To: ${convertDateTo12HourFormat(eventToDate.value)}`)
    
    for (let i = 0; i< idListOne.length; i++) {
      let idOne = document.getElementById(idListOne[i]).value;
      let idTwo = document.getElementById(idListTwo[i]).value;
      if (idOne != "" && idOne != null && idTwo != "" && idTwo != null) {
        dateListValues.push(`From: ${convertDateTo12HourFormat(idOne)}, To: ${convertDateTo12HourFormat(idTwo)}`)
      }
      
    }

    
    try {
      let userID = localStorage.getItem("User ID");
      const docRef = await addDoc(collection(db, "Events"), {
        eventName: eventName.value,
        eventcolor: eventSelectColor.value,
        TableNum: Number(eventTableNum.value),
        MeetingLength: Number(eventMeetingLength.value),
        Dates: dateListValues,
        eventOwnerID: userID
      })

      


      var userEventId = localStorage.getItem("event ID");
      var userEventName = localStorage.getItem("UserName");

      const userRef = doc(db, "Events", docRef.id, "users", userID);
      setDoc(userRef, {
        name: userEventName || null,
        rank: 1
      });

      await addDoc(collection(db, "Events", docRef.id, "buttons"), {
        btnName: "Attendees",
        btnURL: "attendees.html",
        eventBtnID: docRef.id,
        hidden: false,
      });
      await addDoc(collection(db, "Events", docRef.id, "buttons"), {
        btnName: "Polls",
        btnURL: "polls.html",
        eventBtnID: docRef.id,
        hidden: false,
      });
      await addDoc(collection(db, "Events", docRef.id, "buttons"), {
        btnName: "Chats",
        btnURL: "chat.html",
        eventBtnID: docRef.id,
        hidden: false,
      });

      await addDoc(collection(db, "Events", docRef.id, "buttons"), {
        btnName: "Meetings",
        btnURL: "meeting.html",
        eventBtnID: docRef.id,
        hidden: false,
      });

      alert("Event Added Successfully")
      location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
});
}


const querySnapshot = await getDocs(collection(db, "excelSheetMembers"));
querySnapshot.forEach((doc) => {

  if (doc.data().rank != 2) {

    // List for Coordinators Page
    let listContainer = document.querySelector("#list-container");
  
    if (listContainer) {
      let listBlock = document.createElement("div");
  
    listBlock.innerHTML = `
    <a class="rounded-xl w-full grid grid-cols-12 bg-grey text-white shadow-xl p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform" href="#">
                      
    <!-- Icon -->
    <div class="col-span-12 md:col-span-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    </div>
    
    <!-- Title -->
    <div class="col-span-11 xl: ml-6">
      <p class="text-blue-600 font-semibold"> ${doc.data().firstName} ${doc.data().lastName} </p>
    </div>
    
    <!-- Description -->
    <div class="md:col-start-2 col-span-11 xl: ml-6">
      <p class="text-sm text-gray-800 font-light"> ${doc.data().email} </p>
    </div>
    
  </a>
    `;
  
    listContainer.appendChild(listBlock);
    }
  }

  
});

var adminID = localStorage.getItem("User ID");
const qx = query(collection(db, "Events"), where("eventOwnerID", "==", adminID));

const querySnapshots = await getDocs(qx);
querySnapshots.forEach((doctwo) => {



  // List for Events Page
  let eventContainer = document.querySelector("#event-container");

  if (eventContainer) {

    let eventBlock = document.createElement("div");

    eventBlock.setAttribute('id', `${doctwo.id}`);

    eventBlock.innerHTML = `
    <div class="up-click rounded-xl w-full grid grid-cols-12  text-white shadow-xl p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform"style="background-color: ${doctwo.data().eventcolor};" href="#">
                      
      <!-- Icon -->
      <div class="col-span-12 md:col-span-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      </div>

      <!-- Title -->
      <div class="col-span-11 xl: ml-6">
        <p class="font-semibold"> ${doctwo.data().eventName} </p>
      </div>

      
      <button id=excel-${doctwo.id} class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Add users with excel sheet</button>
      <button id=adduser-${doctwo.id} class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Add users manually</button>
      <button id=edit-${doctwo.id} class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Edit / Delete Event</button>
      <button id=option-${doctwo.id} class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Options</button>
      
      </div>
      `;
      
      // <!-- Description -->
      // <div class="md:col-start-2 col-span-11 xl: ml-6">
      //   <p class="text-sm text-gray-800 font-light"> ${doctwo.data().eventcolor} </p>
      // </div>

    eventContainer.appendChild(eventBlock);
    
    let uploadExcel = document.querySelector(`#excel-${doctwo.id}`);
    if (uploadExcel) {
        uploadExcel.addEventListener('click', () => {

        let excelPop = document.querySelector("#excel-pop");
        if(excelPop) {
        let eventPopUp = document.createElement("div");
        eventPopUp.setAttribute('class', `${doctwo.id}`);

        eventPopUp.innerHTML = `
        <div id="excel-pop-hidden" class="hidden items-center justify-center relative">
          <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
            <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">
                    <svg class="text-blue w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <div class="input_field flex flex-col w-max mx-auto text-center">
                        <label>
                            <input id="upld" class="text-sm cursor-pointer w-36 hidden" type="file"/>
                            <div class="text bg-darkblue text-white border rounded font-semibold cursor-pointer p-1 px-3 hover:bg-blue">Select</div>
                        </label>
        
                        <div class="title text-darkblue uppercase">or drop files here</div>
                    </div>
                    <button type="button" id="close-excel" class="text-white scale-75 bg-darkblue hover:bg-blue focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-auto mt-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Close</button>
                </div>
            </div>
          </div>
        </div>
        `
        excelPop.appendChild(eventPopUp);

        let popHidden = document.querySelector("#excel-pop-hidden");
        popHidden.classList.add("flex");
        popHidden.classList.remove("hidden");

        let closeExcel = document.querySelector("#close-excel");
        if (closeExcel) {
          closeExcel.addEventListener('click',() => {
            popHidden.classList.add("hidden");
            popHidden.classList.remove("flex");
          });
        }

      // **********************

      let upldBtn = document.querySelector("#upld");

      if (upldBtn) {
        upldBtn.addEventListener('change', function handleFile(e) {
          var files = e.target.files, f = files[0];
          var reader = new FileReader();
          reader.onload = async function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var rows = XLSX.utils.sheet_to_json(worksheet, {header:1});

            localStorage.setItem("event ID", doctwo.id);

            for (let i = 0; i < rows.length -1 ; i++) {

              let pass = [];
              pass.push(makepassword(10));


              let eventIds = [];
              eventIds.push(eventPopUp.getAttribute("class"));
              
              

              try {

                const usersRef = collection(db, "excelSheetMembers");
                                                                        
                const notFoundQuery = query(usersRef);
                const notFoundQuerySnapShot = await getDocs(notFoundQuery);

                let found = false;
                let docRefDuplicate;
                notFoundQuerySnapShot.forEach((document) => {
                if(document.data().email == rows[i][2]) {
                  found = true
                  docRefDuplicate = document.id
                }
                  
                });

                let reff;
                if(!found) {
                    reff = await addDoc(collection(db, "excelSheetMembers"), {
                    Name: rows[i][0] || null,
                    Surname: rows[i][1] || null,
                    email: rows[i][2] || null,
                    jobTitle: rows[i][3] || null,
                    Company: rows[i][4] || null,
                    Country: rows[i][5] || null,
                    Password: pass.toString() || null,
                    eventId: eventIds || null,
                    changedPassword: false,
                    rank: 2
                  });
                }
                  var userEventId = localStorage.getItem("event ID");
                  
                  console.log(userEventId);
                  // console.log(reff.id);
                  // console.log(docRefDuplicate);

                  let refNotDuplicate = found ? docRefDuplicate : reff.id;
                  let chatRef = doc(db, "Events", userEventId, "users", refNotDuplicate);
                  setDoc(chatRef, {
                    name: rows[i][0] || null,
                    surname: rows[i][1] || null,
                    rank: 2
                  });
                




                const foundQuery = query(usersRef, where("email", "==", rows[i][2]));
                const foundQuerySnapShot = await getDocs(foundQuery);

                foundQuerySnapShot.forEach(async (document) => {
          

                  let eventList = document.data().eventId
                  let eventArr = Array.from(eventList);


                  if (!eventArr.includes(eventIds.toString())) {
                    console.log("yes")
                    
                    eventArr.push(eventIds.toString())

                    try {
                      
                      const washingtonRef = doc(db, "excelSheetMembers", document.id);

                      // Set the "capital" field of the city 'DC'
                      await updateDoc(washingtonRef, {
                        eventId: eventArr
                      });
                      
                      console.log("Success");
                    } catch (e) {
                      // This will be a "population is too big" error.
                      console.error(e);
                    }

                  } else {
                    console.log("no")
                  }
                });

                console.log("DONE")
              } catch (e) {
                console.error("Error adding document: ", e);
              }

            } 

            alert("Users Added Successfully");
            location.reload()

          };
          reader.readAsBinaryString(f);
        })
      }

      // **********************

    }

      })
    }

    // -----------------------------
    
    let uploadUser = document.querySelector(`#adduser-${doctwo.id}`);
    if (uploadUser) {
        uploadUser.addEventListener('click', () => {
          localStorage.setItem("event ID", `${doctwo.id}`);
        let addPop = document.querySelector("#add-user");
        if(addPop) {
        let addUserPopUp = document.createElement("div");
        addUserPopUp.setAttribute('class', `${doctwo.id}`);
        
        
        addUserPopUp.innerHTML = `
        
        <div id="add-user-pop" class="hidden items-center justify-center absolute top-[5rem]">
          <div class=" flex sticky z-10 top-0 w-full h-full bg-black bg-opacity-60">
            <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">
                    
                <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <input autocomplete="off" required id="name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Name" />
                    <label for="name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Name</label>
                  </div>

                  <div id="user-error-one"></div>
                  
                  <div class="relative">
                    <input autocomplete="off" required id="surname" name="surname" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Surname" />
                    <label for="surname" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Surname</label>
                  </div>

                  <div id="user-error-two"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="user-email" name="email" type="email" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
                    <label for="user-email" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                  </div>

                  <div id="user-error-three"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="job-title" name="Jobtitle" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Job Title" />
                    <label for="job-title" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Job Title</label>
                  </div>

                  <div id="user-error-four"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="company" name="company" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Company" />
                    <label for="company" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Company</label>
                  </div>

                  <div id="user-error-five"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="country" name="country" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="country" />
                    <label for="country" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">country</label>
                  </div>

                  <div id="user-error-six"></div>

                  <div class="relative">
                    <button id="add-user-btn" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">Add</button>
                    <button id="close-user-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                  </div>
                </div>

                </div>
            </div>
          </div>
        </div>

        

        `
        addPop.appendChild(addUserPopUp);

        let overlay = document.querySelector(".overlay");
        let addpopHidden = document.querySelector("#add-user-pop");
        addpopHidden.classList.add("flex");
        addpopHidden.classList.remove("hidden");
        overlay.classList.remove("hidden");

        let closeExcel = document.querySelector("#close-user-btn");
        if (closeExcel) {
          closeExcel.addEventListener('click',() => {
            addpopHidden.classList.add("hidden");
            addpopHidden.classList.remove("flex");
            overlay.classList.add("hidden");
          });
        }

        let upldBtn = document.querySelector("#add-user-btn");

        if (upldBtn) {
          upldBtn.addEventListener('click', async() => {
                
                localStorage.setItem("event ID", doctwo.id);


                let username = document.querySelector("#name");
                let surname = document.querySelector("#surname");
                let userEmail = document.querySelector("#user-email");
                let jobtitle = document.querySelector("#job-title");
                let company = document.querySelector("#company");
                let country = document.querySelector("#country");
                
                
                let userErrorOne = document.querySelector("#user-error-one");
                let userErrorTwo = document.querySelector("#user-error-two");
                let userErrorThree = document.querySelector("#user-error-three");
                let userErrorFour = document.querySelector("#user-error-four");
                let userErrorFive = document.querySelector("#user-error-five");
                let userErrorSix = document.querySelector("#user-error-six");
                


                let pass = [];
                pass.push(makepassword(10));
  
  
                let eventIds = [];
                eventIds.push(addUserPopUp.getAttribute("class"));
                
                
                if (username.value === '' || username.value === null ||surname.value === '' || surname.value === null || userEmail.value === '' || userEmail.value === null || jobtitle.value === '' || jobtitle.value === null || company.value === '' || company.value === null || country.value === '' || country.value === null) {
                  if (username.value === '' || username.value === null) {
              
                    userErrorOne.innerHTML = "*Name is required"
                  } else {
                    userErrorOne.classList.add("hidden")
                  }
                
                  if (surname.value === '' || surname.value === null) {
                
                    userErrorTwo.innerHTML = "*Surname is required"
                  } else {
                    userErrorTwo.classList.add("hidden")
                  }
                
                  if (userEmail.value === '' || userEmail.value === null) {
                
                    userErrorThree.innerHTML = "*Email Address is required"
                  } else {
                    userErrorThree.classList.add("hidden")
                  }

                  if (jobtitle.value === '' || jobtitle.value === null) {
                
                    userErrorFour.innerHTML = "*job title is required"
                  } else {
                    userErrorFour.classList.add("hidden")
                  }

                  if (company.value === '' || company.value === null) {
                
                    userErrorFive.innerHTML = "*company name is required"
                  } else {
                    userErrorFive.classList.add("hidden")
                  }

                  if (country.value === '' || country.value === null) {
                
                    userErrorSix.innerHTML = "*country is required"
                  } else {
                    userErrorSix.classList.add("hidden")
                  }
                } else {
                  try {
  
                    const usersRef = collection(db, "excelSheetMembers");
                                                                            
                    const notFoundQuery = query(usersRef);
                    const notFoundQuerySnapShot = await getDocs(notFoundQuery);
    
                    let found = false;
                    let docRefDuplicate;
                    notFoundQuerySnapShot.forEach((document) => {
                    if(document.data().email == userEmail.value) {
                      found = true;
                      docRefDuplicate = document.id;
                    }
                      
                    });
    
                    let reff;
                    if(!found) {
                        const reff = await addDoc(collection(db, "excelSheetMembers"), {
                        Name: username.value,
                        Surname: surname.value,
                        email: userEmail.value,
                        jobTitle: jobtitle.value,
                        Company: company.value,
                        Country: country.value,
                        Password: pass.toString() || null,
                        eventId: eventIds || null,
                        changedPassword: false,
                        rank: 2
                      });
                      
                    }

                    var userEventId = localStorage.getItem("event ID");

                    let refNotDuplicate = found ? docRefDuplicate : reff.id;

                    let chatRef = doc(db, "Events", userEventId, "users", refNotDuplicate);
                    setDoc(chatRef, {
                      name: username.value,
                      surname: surname.value,
                      rank: 2
                    });
    
    
                    const foundQuery = query(usersRef, where("email", "==", userEmail.value));
                    const foundQuerySnapShot = await getDocs(foundQuery);
    
                    foundQuerySnapShot.forEach(async (document) => {
              
    
                      let eventList = document.data().eventId
                      let eventArr = Array.from(eventList);
    
    
                      if (!eventArr.includes(eventIds.toString())) {
                        console.log("yes")
                        
                        eventArr.push(eventIds.toString())
    
                        try {
                          
                          const washingtonRef = doc(db, "excelSheetMembers", document.id);
    
                          // Set the "capital" field of the city 'DC'
                          await updateDoc(washingtonRef, {
                            eventId: eventArr
                          });
                          
                          console.log("Success");
                        } catch (e) {
                          // This will be a "population is too big" error.
                          console.error(e);
                        }
    
                      } else {
                        console.log("no")
                      }
                    });
    
                    
                    alert("User Added Successfully")
                    location.reload();
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  } 
                }
          })
        }


      }
    })
    }

  }
});



const querySnapshotss = await getDocs(collection(db, "excelSheetMembers"));
querySnapshotss.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots

  let emailInput = document.querySelector("#email");
  let passInput = document.querySelector("#password");
  let logBtn = document.querySelector("#login-btn");
  
  let emailError = document.querySelector("#email-error");
  let passError = document.querySelector("#pass-error");


  if (logBtn) {
    logBtn.addEventListener('click', () => {
      if (emailInput.value != doc.data().email || passInput.value != doc.data().password) {
        
        if (emailInput.value != doc.data().email) {
          emailError.innerHTML = "*Email Address is incorrect"
        } else {
          emailError.classList.add("hidden")
        }

        if (passInput.value != doc.data().password) {
          passError.innerHTML = "*Password is incorrect"
        } else {
          passError.classList.add("hidden")
        }

      } else {
        localStorage.setItem("User ID", doc.id);
        localStorage.setItem("UserName", `${doc.data().firstName} ${doc.data().lastName}`);
        localStorage.setItem("isLogged", `True`);
        
        window.location.href = `events.html`;

      }
    } )
  }

});

// Admin Checker:

let CoordinatorBtn = document.querySelector(".admin");


const querySnapshoxxt = await getDocs(collection(db, "excelSheetMembers"));
querySnapshoxxt.forEach(async(doc) => {

  if (adminID === doc.id && doc.data().rank === 0) {
    CoordinatorBtn.classList.remove("hidden");
  }

});


const querySnapshotsx = await getDocs(collection(db, "Events"));
querySnapshotsx.forEach((doccc) => {
  // doc.data() is never undefined for query doc snapshots

  let editBtn = document.querySelector(`#edit-${doccc.id}`)

  if (editBtn) {
    editBtn.addEventListener('click', () => {

      let editPop = document.querySelector("#edit-event");
        if(editPop) {
        let editEventPopUp = document.createElement("div");
        editEventPopUp.setAttribute('class', `${doccc.id}`);

        editEventPopUp.innerHTML = `
        
        <div id="edit-event-pop" class="hidden items-center justify-center relative">
          <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60" style="overflow-y: overlay;">
            <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">

                <div id="edit-form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <input autocomplete="off" required id="edit-event-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Event Name" value="${doccc.data().eventName}"/>
                    <label for="edit-event-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Event Name</label>
                  </div>

                  <div id="edit-error-one"></div>

                  <div class="relative" id="mrg">
                    <label for="edit-event-color" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Add Event Color:</label>
                    <input type="color" name="colors" id="edit-event-color" class="mt-4 border-black" value="${doccc.data().eventcolor}">
                  </div>
                  

                  <div id="edit-error-two"></div>
                  
                  <div class="relative !my-6">
                    <label for="table-edit-number" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Number of Tables:</label>
                    <input type="number" name="table-number" id="table-edit-number" class="mt-4 border-black border-2 rounded-full w-[28%] px-4" min="1" max="999" value="${doccc.data().TableNum}">
                  </div>
                  

                  <div id="edit-error-three"></div>

                  <div class="relative !my-6">
                    <label for="meeting-edit-length" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Length of Meeting: (in Minutes)</label>
                    <input type="number" name="meeting-length" id="meeting-edit-length" class="mt-4 border-black border-2 rounded-full w-[28%] px-4" min="1" max="999" value="${doccc.data().MeetingLength}">
                  </div>

                  <div id="edit-error-four"></div>

                  </div>
                  <button id="edit-date-btn" class="bg-black hover:bg-darkblue text-white rounded-md px-2 py-1 my-4 w-full">Add Date</button>
                  <div class="relative">
                    <button id="edit-event-btn" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">Edit</button>
                    <button id="delete-event-btn" class="bg-red hover:bg-blue text-white rounded-md px-2 py-1">Delete</button>
                    <button id="close-event-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                  </div>

                </div>
            </div>
          </div>
        </div>
        `
        editPop.appendChild(editEventPopUp);


        // ****************
        function extractDates(dateStr) {
          const currentYear = new Date().getFullYear();
          const fromIndex = dateStr.indexOf('From:') + 5; // start index of "From:" substring
          const toIndex = dateStr.indexOf(', To:'); // end index of "From:" substring
          const fromStr = dateStr.substring(fromIndex, toIndex).trim(); // extract "From:" substring and remove whitespace
          const toStr = dateStr.substring(toIndex + 6).trim(); // extract "To:" substring and remove whitespace
          const fromDate = new Date(`${fromStr} ${currentYear}`); // parse "From:" date string
          const toDate = new Date(`${toStr} ${currentYear}`); // parse "To:" date string
          const fromOffset = fromDate.getTimezoneOffset() * 60000; // get timezone offset in milliseconds and convert to negative value
          const toOffset = toDate.getTimezoneOffset() * 60000; // get timezone offset in milliseconds and convert to negative value
          const fromUTC = fromDate.getTime() - fromOffset; // get UTC timestamp for "From:" date
          const toUTC = toDate.getTime() - toOffset; // get UTC timestamp for "To:" date
          const fromISO = new Date(fromUTC).toISOString().substring(0, 16); // convert "From:" date to ISO format and remove seconds and milliseconds
          const toISO = new Date(toUTC).toISOString().substring(0, 16); // convert "To:" date to ISO format and remove seconds and milliseconds
          return [fromISO, toISO];
        }

        
        
        // ****************
        
        for (let i = 0; i < doccc.data().Dates.length; i++) {
          const dateString = doccc.data().Dates[i];
          const [fromDateISO, toDateISO] = extractDates(dateString);
          console.log(fromDateISO); // "2023-04-11T22:30"
          console.log(toDateISO); // "2023-04-11T23:32"
          let newOpt = document.createElement("div");
          let form = document.querySelector("#edit-form");
          newOpt.classList.add("relative");
          // newOpt.setAttribute("id", `${count}-id`)

          newOpt.innerHTML = `

          <div class="relative !my-6">
            <label for="from-edit-date-${doccc.id}-${i}" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">From:</label>
            <input type="datetime-local" value="${fromDateISO}" name="from-event-date" id="from-edit-date-${doccc.id}-${i}" class="mt-4 border-black border-2 rounded-full w-full px-4">
          </div>
          

          <div id="edit-error-five"></div>
          
          
          <div class="relative !my-6">
            <label for="to-edit-date-${doccc.id}-${i}" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">To:</label>
            <input type="datetime-local" value="${toDateISO}"" name="to-event-date" id="to-edit-date-${doccc.id}-${i}" class="mt-4 border-black border-2 rounded-full w-full px-4">
          </div>
          

          <div id="edit-error-six"></div>
          `
          form.appendChild(newOpt);
        }
        

        let overlay = document.querySelector(".overlay");
        let editpopHidden = document.querySelector("#edit-event-pop");
        editpopHidden.classList.add("flex");
        editpopHidden.classList.remove("hidden");
        overlay.classList.remove("hidden");

        let closeEventPop = document.querySelector("#close-event-btn");
        if (closeEventPop) {
          closeEventPop.addEventListener('click',() => {
            editpopHidden.classList.add("hidden");
            editpopHidden.classList.remove("flex");
            overlay.classList.add("hidden");
          });
        }

        let deleteEvent = document.querySelector("#delete-event-btn");
        if (deleteEvent) {
          deleteEvent.addEventListener('click', async () => {
            let eventID = editEventPopUp.getAttribute('class');
            

            editpopHidden.classList.add("hidden");
            editpopHidden.classList.remove("flex");
            overlay.classList.add("hidden");

            if (window.confirm("Do you really want to delete this event?")) {
              try {
                await deleteDoc(doc(db, "Events", eventID))
                alert("Event Deleted Successfully!")
                location.reload();
              } catch (e){
                console.log(e)
              }
            }
          });
        }

        let editEvent = document.querySelector("#edit-event-btn");
        if (editEvent) {

          let idListOne = [];
          let idListTwo = [];
          let dateListValues = [];

          let addDate = document.querySelector("#edit-date-btn");
          if (addDate) {

            var count = 2;
            addDate.addEventListener('click', () => {
              count++;

              if (count>20){
                addDate.disabled = true;
                addDate.classList.add("hidden");
              } else {
                
                  let newOpt = document.createElement("div");
                  let form = document.querySelector("#edit-form");
                  newOpt.classList.add("relative");
                  // newOpt.setAttribute("id", `${count}-id`)
          
                  newOpt.innerHTML = `

                  <div class="relative !my-6">
                    <label for="from-event-date-${count}-id" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">From:</label>
                    <input type="datetime-local" name="meeting-length" id="from-event-date-${count}-id" class="mt-4 border-black border-2 rounded-full w-full px-4">
                  </div>
                  

                  <div id="event-error-five"></div>
                  
                  
                  <div class="relative !my-6">
                    <label for="to-event-date-${count}-id" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">To:</label>
                    <input type="datetime-local" name="meeting-length" id="to-event-date-${count}-id" class="mt-4 border-black border-2 rounded-full w-full px-4">
                  </div>
                  `
                  form.appendChild(newOpt);
              }

              let dd = document.querySelector(`#from-event-date-${count}-id`);
              let bb = document.querySelector(`#to-event-date-${count}-id`);
              let ww = dd.getAttribute("id");
              let mm = bb.getAttribute("id");
              // if (dd) {

              //   console.log(dd.value)
              // }

            
              idListOne.push(ww)
              idListTwo.push(mm)

              // dateListValues.push(`From: ${dd.value} To: ${bb.value}`)

              // console.log(dateListValues);

              console.log(idListOne);
              console.log(idListTwo);
              console.log(count);
              
            })
            
            
          }


          editEvent.addEventListener('click', async () => {

            let editErrorOne = document.querySelector("#edit-error-one");
            let editErrorTwo = document.querySelector("#edit-error-two");
            let eventErrorThree = document.querySelector("#edit-error-three");
            let eventErrorFour = document.querySelector("#edit-error-four");
            let eventErrorFive = document.querySelector("#edit-error-five");
            let eventErrorSix = document.querySelector("#edit-error-six");

            let editEventName = document.querySelector("#edit-event-name");
            let editEventColor = document.querySelector("#edit-event-color");
            let editTableNum = document.querySelector("#table-edit-number");
            let editMeetingLength = document.querySelector("#meeting-edit-length");
            let editFromDate = document.querySelector(`#from-edit-date-${doccc.id}-0`);
            let editToDate = document.querySelector(`#to-edit-date-${doccc.id}-0`);

            if (editEventName.value === '' || editEventName.value === null || editEventColor.value === '#000000' || editMeetingLength.value === '' || editMeetingLength.value === null || editTableNum.value === '' || editTableNum.value === null || editFromDate.value === '' || editFromDate.value === null || editToDate.value === '' || editToDate.value === null) {
              if (editEventName.value === '' || editEventName.value === null) {
          
                editErrorOne.innerHTML = "*Event name is required"
              } else {
                editErrorOne.classList.add("hidden")
              }
            
              if (editEventColor.value === '#000000' || '#003366' || '#008dff' || '#FFFFFF' || '#fff0') {
            
                editErrorTwo.innerHTML = "*Select Another Color"
              } else {
                editErrorTwo.classList.add("hidden")
              }

              if (editTableNum.value === '' || editTableNum.value === null) {
  
                eventErrorThree.innerHTML = "*Select Number of Tables"
              } else {
                eventErrorThree.classList.add("hidden")
              }

              if (editMeetingLength.value === '' || editMeetingLength.value === null) {
  
                eventErrorFour.innerHTML = "*Select Length of Meeting"
              } else {
                eventErrorFour.classList.add("hidden")
              }

              if (editFromDate.value === '' || editFromDate.value === null) {
  
                eventErrorFive.innerHTML = "*Select Date"
              } else {
                eventErrorFive.classList.add("hidden")
              }

              if (editToDate.value === '' || editToDate.value === null) {
  
                eventErrorSix.innerHTML = "*Select Date"
              } else {
                eventErrorSix.classList.add("hidden")
              }

            } else {
              let eventID = editEventPopUp.getAttribute('class');

              for (let i = 0; i < doccc.data().Dates.length; i++) {
                dateListValues.push(`From: ${convertDateTo12HourFormat(document.getElementById(`from-edit-date-${doccc.id}-${i}`).value)}, To: ${convertDateTo12HourFormat(document.getElementById(`to-edit-date-${doccc.id}-${i}`).value)}`)
              }

    
              for (let i = 0; i< idListOne.length; i++) {
                let idOne = document.getElementById(idListOne[i]).value;
                let idTwo = document.getElementById(idListTwo[i]).value;
                if (idOne != "" && idOne != null && idTwo != "" && idTwo != null) {
                  dateListValues.push(`From: ${convertDateTo12HourFormat(idOne)}, To: ${convertDateTo12HourFormat(idTwo)}`)
                }
                
              }

              try {

                const eventRef = doc(db, "Events", eventID);
                await updateDoc(eventRef, {
                  eventName: editEventName.value,
                  eventcolor: editEventColor.value,
                  TableNum: editTableNum.value,
                  MeetingLength: editMeetingLength.value,
                  Dates: dateListValues,
                });
                alert("Event Edited")
                location.reload();

              } catch(e) {
                console.log(e)
              }

            }
          });

        }
      }
    });
  }

});

const querySnapshott = await getDocs(collection(db, "Events"));
querySnapshott.forEach(async(doccc) => {
  // doc.data() is never undefined for query doc snapshots

  let optBtn = document.querySelector(`#option-${doccc.id}`)

  if (optBtn) {
    optBtn.addEventListener('click', async () => {

      let optPop = document.querySelector("#option-pop");
      
        if (optPop) {
        let optionPopUp = document.createElement("div");
        optionPopUp.setAttribute('class', `${doccc.id}`);
        let ids = optionPopUp.getAttribute('class')
        localStorage.setItem("event ID", ids);

        optionPopUp.innerHTML = `
        
        <div id="opt-event-pop" class="hidden items-center justify-center relative">
        <div  class=" flex fixed z-10 top-0 w-full h-full bg-navy bg-opacity-60 flex-col items-center ">
        <div  class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg grid gap-[1rem] grid-cols-4">
              <div id=add-opt-${doccc.id}>
                <a href="#" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-green border border-green rounded-lg shadow hover:bg-darkgreen">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">Add Option</h5>
                </a>
              </div>

              </div>
              <div class="relative mb-10">
                <button id="close-opt-btn" class="bg-red hover:bg-black text-white rounded-md px-10 py-1 mr-2">Close</button>
                <button id="edit-opt-btn" class="bg-green hover:bg-black text-white rounded-md px-10 py-1 ml-2">Edit</button>
                <button id="hide-opt-btn" class="bg-blue hover:bg-black text-white rounded-md px-10 py-1 ml-2">Hide</button>
              </div>
          </div>
        </div>
        `
        optPop.appendChild(optionPopUp);
        var eventPopId = localStorage.getItem("event ID");
        const q = query(collection(db, "Events", eventPopId, "buttons"), where("eventBtnID", "==", eventPopId));
      
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((ddoc) => {

          let addOptBtn = document.querySelector(`#add-opt-${doccc.id}`)
          let newBtn = document.createElement("div");
          newBtn.setAttribute('class', "relative")

          if (ddoc.data().hidden == true) {
            newBtn.classList.add('opacity-30');

            
          }

          newBtn.innerHTML = `
        

          <a href="${ddoc.data().btnURL}" target="_self" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border border-navy rounded-lg shadow hover:bg-black">
            <h5 class="mb-2 text-2xl text-btn text-center font-bold tracking-tight text-white">${ddoc.data().btnName}</h5>
          </a>
          `
          addOptBtn.before(newBtn)


          let hideBtns = document.querySelector("#hide-opt-btn");
          hideBtns.addEventListener('click', () => {

            if (ddoc.data().hidden == true) {
              newBtn.classList.add('opacity-30');
            }

            newBtn.innerHTML = `
            <div id="hide-${ddoc.id}" class="absolute -top-1 w-5 bg-white rounded-full -right-1 hover:bg-black transition-colors">
              <img src="./imgs/visibility-eye-svgrepo-com.svg" alt="close" class="cursor-pointer">
            </div>
              
            <div class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-black border border-black rounded-lg shadow">
              <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${ddoc.data().btnName}</h5>
            </div>
            `

            let hideIcon = document.querySelector(`#hide-${ddoc.id}`);

            hideIcon.addEventListener('click', async() => {
              
              newBtn.classList.toggle('opacity-30');


                const hideRef = doc(db, "Events", eventPopId, "buttons", ddoc.id);
                await updateDoc(hideRef, {
                  hidden: newBtn.getAttribute('class') == "relative opacity-30",
                });

            });

          });


          let editBtns = document.querySelector("#edit-opt-btn");
          
          editBtns.addEventListener('click', () => {

            if (ddoc.data().btnName != "Chats" && ddoc.data().btnName != "Polls" && ddoc.data().btnName != "Attendees" && ddoc.data().btnName != "Meetings") {

              newBtn.innerHTML = `
              <div id="close-${ddoc.id}" class="absolute -top-1 w-5 bg-white rounded-full -right-1 hover:bg-black transition-colors">
                <img src="./imgs/close-red-icon.svg" alt="close" class="cursor-pointer">
              </div>
              <div id="edit-${ddoc.id}" class="absolute -top-1 p-[2px] w-5 bg-blue rounded-full right-6 hover:bg-darkblue transition-colors">
                <img src="./imgs/icons8-edit.svg" alt="close" class="cursor-pointer">
              </div>
                
                <div class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-black border border-black rounded-lg shadow">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${ddoc.data().btnName}</h5>
                </div>
                `
                let closeBtns = document.querySelector(`#close-${ddoc.id}`)
                closeBtns.addEventListener('click', async() => {
      
                  if (window.confirm("Do you really want to delete this Button?")) {
                    try {
                      await deleteDoc(doc(db, "Events", eventPopId, "buttons", ddoc.id));
                      alert("Button Deleted Successfully")
                      location.reload();
                    } catch (e){
                      console.log(e)
                    }
                  }
      
                });
  
                let editBtns = document.querySelector(`#edit-${ddoc.id}`)
                editBtns.addEventListener('click', async() => {
      
                  // **************
  
                  let editbtnpop = document.querySelector("#edit-btn-pop");
                  let editBtnPopUp = document.createElement("div");
      
                editBtnPopUp.innerHTML = `
                
                <div id="edit-btn-popup" class="hidden items-center justify-center relative">
                  <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
                    <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                        <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">
      
                        <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                          <div class="relative">
                            <input autocomplete="off" required id="edit-btn-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button Name" value="${ddoc.data().btnName}" />
                            <label for="edit-btn-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button Name</label>
                          </div>
      
                          <div id="btn-error-one"></div>
      
                          <div class="relative">
                            <input autocomplete="off" required pattern="https://.*" id="edit-btn-link" name="name" type="url" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button URL" value="${ddoc.data().btnURL}" />
                            <label for="edit-btn-link" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button URL</label>
                          </div>
                          
      
                          <div id="btn-error-two"></div>
      
                          <div class="relative">
                            <button id="edit-btn-click" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">add</button>
                            <button id="close-edit-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                          </div>
                        </div>
      
                        </div>
                    </div>
                  </div>
                </div>
                `
                editbtnpop.appendChild(editBtnPopUp);
      
                let overlay = document.querySelector(".overlay");
                let editBtnPopHidden = document.querySelector("#edit-btn-popup");
                editBtnPopHidden.classList.add("flex");
                editBtnPopHidden.classList.remove("hidden");
                overlay.classList.remove("hidden");
      
                let closeEventPop = document.querySelector("#close-edit-btn");
                if (closeEventPop) {
                  closeEventPop.addEventListener('click',() => {
                    editBtnPopHidden.classList.add("hidden");
                    editBtnPopHidden.classList.remove("flex");
                    overlay.classList.add("hidden");
                  });
                }
      
  
                let editBtnName = document.querySelector("#edit-btn-name");
                let editBtnURL = document.querySelector("#edit-btn-link");
  
                let editBtnClick = document.querySelector("#edit-btn-click");
  
  
                editBtnClick.addEventListener('click', async() => {
  
                  if (window.confirm("Confirm Edits ?")) {
                    try {
                    
                      const pollEditRef = doc(db, "Events", eventPopId, "buttons", ddoc.id);
                      await updateDoc(pollEditRef, {
                        btnName: editBtnName.value,
                        btnURL: editBtnURL.value,
                      });
              
                      location.reload();
                    } catch (error) {
                      console.error(error)
                    }
                  }
                })
  
  
                  // **************
      
                });


            }


            })

          

        });



        let overlay = document.querySelector(".overlay");
        let optpopHidden = document.querySelector("#opt-event-pop");
        if (optpopHidden) {

          optpopHidden.classList.add("flex");
          optpopHidden.classList.remove("hidden");
          overlay.classList.remove("hidden");
        }

        let closeOptPop = document.querySelector("#close-opt-btn");
        if (closeOptPop) {
          closeOptPop.addEventListener('click',() => {
            optionPopUp.remove()
            overlay.classList.add("hidden");
          });
        }

        let addbtn = document.querySelector(`#add-opt-${doccc.id}`);
        if (addbtn) {
          addbtn.addEventListener('click',() => {

            let addbtnpop = document.querySelector("#add-btn-pop");
            let addBtnPopUp = document.createElement("div");

          addBtnPopUp.innerHTML = `
          
          <div id="add-btn-popup" class="hidden items-center justify-center relative">
            <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
              <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                  <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">

                  <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div class="relative">
                      <input autocomplete="off" required id="new-btn-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button Name" />
                      <label for="new-btn-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button Name</label>
                    </div>

                    <div id="btn-error-one"></div>

                    <div class="relative">
                      <input autocomplete="off" required pattern="https://.*" id="new-btn-link" name="name" type="url" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button URL" />
                      <label for="new-btn-link" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button URL</label>
                    </div>
                    

                    <div id="btn-error-two"></div>

                    <div class="relative">
                      <button id="add-btn-click" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">add</button>
                      <button id="close-event-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                    </div>
                  </div>

                  </div>
              </div>
            </div>
          </div>
          `
          addbtnpop.appendChild(addBtnPopUp);

          let overlay = document.querySelector(".overlay");
          let addBtnPopHidden = document.querySelector("#add-btn-popup");
          addBtnPopHidden.classList.add("flex");
          addBtnPopHidden.classList.remove("hidden");
          overlay.classList.remove("hidden");

          let closeEventPop = document.querySelector("#close-event-btn");
          if (closeEventPop) {
            closeEventPop.addEventListener('click',() => {
              addBtnPopHidden.classList.add("hidden");
              addBtnPopHidden.classList.remove("flex");
              overlay.classList.add("hidden");
            });
          }


          let eventNewBtn = document.querySelector("#add-btn-click");
        if (eventNewBtn) {
          eventNewBtn.addEventListener('click', async () => {

            let btnErrorOne = document.querySelector("#btn-error-one");
            let btnErrorTwo = document.querySelector("#btn-error-two");

            let newBtnName = document.querySelector("#new-btn-name");
            let newBtnLink = document.querySelector("#new-btn-link");

            if (newBtnName.value === '' || newBtnName.value === null || newBtnLink.value === '' || newBtnLink.value === null) {
              if (newBtnName.value === '' || newBtnName.value === null) {
          
                btnErrorOne.innerHTML = "*Button name is required"
              } else {
                btnErrorOne.classList.add("hidden")
              }
            
              if (newBtnLink.value === '' || newBtnLink.value === null) {
            
                btnErrorTwo.innerHTML = "*Button URL is required"
              } else {
                btnErrorTwo.classList.add("hidden")
              }
            } else {

              try {

                var eventPopId = localStorage.getItem("event ID");
                console.log(eventPopId)


                const btnRef = await addDoc(collection(db, "Events", eventPopId, "buttons"), {
                  btnName: newBtnName.value,
                  btnURL: newBtnLink.value,
                  eventBtnID: eventPopId,
                });

                addBtnPopHidden.classList.add("hidden");
                addBtnPopHidden.classList.remove("flex");
                alert("New Button Added!")
                location.reload();
              } catch(e) {
                console.log(e)
              }

            }
          });

        }

          });
          }

      }
    });
  }

});


let userID = localStorage.getItem("chatUser");

  var eventPopId = localStorage.getItem("event ID");
  const q = query(collection(db, "excelSheetMembers"), where("eventId", "array-contains", eventPopId));

  const querySnapshotot = await getDocs(q);
  querySnapshotot.forEach(async(docx) => {

    if (docx.data().Name != "Name" && "name") {

      let attendContainer = document.querySelector("#attend-container");
  
      if (attendContainer) {
        let attendList = document.createElement("tbody");
        // attendList.setAttribute('class', `${doccc.id}`);
  
        attendList.innerHTML = `
        <tr id=row-${docx.id} class="bg-navy border-b border-grey">
          <td scope="row" class="px-3 py-4 font-medium text-white whitespace-nowrap">
            <button id=editAttend-${docx.id}
              class="flex space-x-2 items-center px-4 py-2 bg-green hover:bg-darkgreen rounded-full drop-shadow-md">
                <svg class="fill-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                  viewBox="0 0 50 50">
                  <path
                    d="M 46.574219 3.425781 C 45.625 2.476563 44.378906 2 43.132813 2 C 41.886719 2 40.640625 2.476563 39.691406 3.425781 C 39.691406 3.425781 39.621094 3.492188 39.53125 3.585938 C 39.523438 3.59375 39.511719 3.597656 39.503906 3.605469 L 4.300781 38.804688 C 4.179688 38.929688 4.089844 39.082031 4.042969 39.253906 L 2.035156 46.742188 C 1.941406 47.085938 2.039063 47.453125 2.292969 47.707031 C 2.484375 47.898438 2.738281 48 3 48 C 3.085938 48 3.171875 47.988281 3.257813 47.964844 L 10.746094 45.957031 C 10.917969 45.910156 11.070313 45.820313 11.195313 45.695313 L 46.394531 10.5 C 46.40625 10.488281 46.410156 10.472656 46.417969 10.460938 C 46.507813 10.371094 46.570313 10.308594 46.570313 10.308594 C 48.476563 8.40625 48.476563 5.324219 46.574219 3.425781 Z M 45.160156 4.839844 C 46.277344 5.957031 46.277344 7.777344 45.160156 8.894531 C 44.828125 9.222656 44.546875 9.507813 44.304688 9.75 L 40.25 5.695313 C 40.710938 5.234375 41.105469 4.839844 41.105469 4.839844 C 41.644531 4.296875 42.367188 4 43.132813 4 C 43.898438 4 44.617188 4.300781 45.160156 4.839844 Z M 5.605469 41.152344 L 8.847656 44.394531 L 4.414063 45.585938 Z">
                  </path>
                </svg>
              <span class="text-white text-md">Edit</span>
            </button>
          </td>
          <td id=name-${docx.id} scope="row" class="px-6 py-4 overflow-ellipsis font-medium text-white whitespace-nowrap max-w-[160px]" style="overflow-wrap: break-word;">
              ${docx.data().Name}
          </td>
          <td id=sur-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
            ${docx.data().Surname}
          </td>
          <td id=email-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
              ${docx.data().email}
          </td>
          <td id=job-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
              ${docx.data().jobTitle}
          </td>
          <td id=company-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
              ${docx.data().Company}
          </td>
          <td id=country-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
              ${docx.data().Country}
          </td>
          <td id=II-${docx.id}-invite class="px-3 py-4">
          <button id=II-${docx.id} type="button" class="text-white bg-blue hover:bg-darkblue font-medium rounded-lg text-sm px-5 py-2.5 max-h-[60px]">Invite To Meeting</button>
          </td>

          <td id=CC-${docx.id}-chat class="px-3 py-4">
            <a href="chatroom.html"><button id=CC-${docx.id} type="button" class="text-white bg-blue hover:bg-darkblue font-medium rounded-lg text-sm px-5 py-5 max-h-[60px]">Chat</button></a>
          </td>

          <td id=CC-${docx.id}-addBtn class="px-3 py-4">
            <button id=CC-${docx.id} type="button" class="text-white bg-blue hover:bg-darkblue font-medium rounded-lg text-sm px-5 py-2.5 max-h-[60px]">Add Button</button>
          </td>
            
        </tr>
        `
        attendContainer.appendChild(attendList);
      }
    }

    let editBtnUser = document.querySelector(`#editAttend-${docx.id}`);
    if (editBtnUser) {

      editBtnUser.addEventListener('click', async() => {
        localStorage.setItem("chatUser", docx.id);

        
      });
    }

    let addBtnUser = document.querySelector(`#CC-${docx.id}-addBtn`);
    if (addBtnUser) {

      addBtnUser.addEventListener('click', async() => {
        localStorage.setItem("chatUser", docx.id);

      });
    }

    let goChatBtn = document.querySelector(`#CC-${docx.id}-chat`);

    if (goChatBtn) {

      goChatBtn.addEventListener('click', () => {
        localStorage.setItem("chatUser", `${docx.id}`);
        
      });
    }
    
    let inviteContainer = document.querySelector(`#II-${docx.id}-invite`)
    let inviteBTn = document.querySelector(`#II-${docx.id}`)
    let adminName = localStorage.getItem("UserName")

    let meetingPop = document.querySelector("#meeting-btn-pop");
    if (inviteBTn) {
      inviteBTn.addEventListener('click', async() => {

        meetingPop.innerHTML = `
        <div id="invitePop" class=" flex fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-60" style="overflow-y: overlay;">
          <div class="extraOutline p-12 bg-white w-[30%] max-w-[405px] bg-whtie m-auto rounded-lg">
        
            <div class="max-w-md mx-auto">
              <div id="close-event-pop" class="hidden">×</div>
              <div>
                <h1 class="text-2xl font-semibold">Invite to Meeting</h1>
              </div>
              <div class="divide-y divide-gray-200">
                <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <label for="table-num" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Select Table Number:</label>

                    <select class="mt-4 border-black w-[20%]" name="table-num" id="table-num">
                    </select>
                  </div>

                  <div id="meeting-error-one"></div>

                  <div class="relative !my-6">
                    <label for="date-range" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Select Date Range:</label>

                    <select class="mt-4 border-black w-full" name="date-range" id="date-range">
                      
                    </select>
                  </div>
                  

                  <div id=meeting-error-two"></div>
                  
                </div>
                <div class="relative border-none">
                  <button id="invite-event-btn" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">Invite</button>
                  <button id="close-invite-btn" class="bg-red hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `

        if (meetingPop) {

          let closeInvitePop = document.querySelector("#close-invite-btn");
          let InvitePop = document.querySelector("#invitePop");
  
          closeInvitePop.addEventListener('click', () => {
            InvitePop.remove()
            overlay.classList.add("hidden");
          });

          let TableNumSelect = document.querySelector("#table-num");
          let dateRangeSelect = document.querySelector("#date-range");
  
          const querySnapshot = await getDocs(collection(db, "Events"));
          querySnapshot.forEach((doc) => {
  
  
            if (doc.id === eventPopId) {
              
              for (let i = 0; i < doc.data().TableNum; i++) {
                let tableNumOption = document.createElement("option");
  
                tableNumOption.innerHTML = `
                  <option value="${i + 1}">${i + 1}</option>
                `
                TableNumSelect.appendChild(tableNumOption)
              }
  
              for (let i = 0; i < doc.data().Dates.length; i++) {
                let dateRangeOption = document.createElement("option");
  
                dateRangeOption.innerHTML = `
                  <option value="${doc.data().Dates[i]}">${doc.data().Dates[i]}</option>
                `
                dateRangeSelect.appendChild(dateRangeOption)
              }
            }
  
          });
  
          let inviteMeetingBtn = document.querySelector("#invite-event-btn");
  
          inviteMeetingBtn.addEventListener('click', async() => {
  
            const docRef = await addDoc(collection(db, "Events", eventPopId, "meetings"), {
              datetime: serverTimestamp(),
              senderID: adminID,
              receiverID: docx.id,
              receiver_username: `${docx.data().Name} ${docx.data().Surname}`,
              sender_username: adminName,
              status: 0,
              TableNum: TableNumSelect.value,
              Date: dateRangeSelect.value,
            });
    
            alert("User Invited Successfully!");
            location.reload();
            
  
          });
        }
        

      })

      const q = query(collection(db, "Events", eventPopId, "meetings"), where("receiverID", "==", docx.id));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        

        inviteContainer.innerHTML = `
          <p class="text-yellow">User invited to meeting</p>
        `

      });

    }


  });


// Polls : 

let closeEventPop = document.querySelector("#close-poll-btn");
let addPoll = document.querySelector("#add-poll");
let pollPop = document.querySelector("#poll-pop");

  if (addPoll) {
    addPoll.addEventListener('click', () => {
      pollPop.classList.remove("hidden");
      pollPop.classList.add("block");
      overlay.classList.remove("hidden");
    });
    
    if (closeEventPop) {
      closeEventPop.addEventListener('click', () => {
        pollPop.classList.add("hidden");
        pollPop.classList.remove("block");
        overlay.classList.add("hidden");
      });
    }
    
    
    let pollBtn = document.querySelector("#add-poll-btn");
    let pollName = document.querySelector("#poll-name");
    let optionOne = document.querySelector("#poll-opt-one");
    let optionTwo = document.querySelector("#poll-opt-two");
    
    let pollErrorOne = document.querySelector("#poll-error-one")
    let pollErrorTwo = document.querySelector("#poll-error-two")
    let pollErrorThree = document.querySelector("#poll-error-three")


    
    let idList = [];
    let addOption = document.querySelector("#add-opt-btn");
    if (addOption) {

      var count = 2;
      addOption.addEventListener('click', () => {
        count++;

        if (count>20){
          addOption.disabled = true;
          addOption.classList.add("hidden");
        } else {
          
            let newOpt = document.createElement("div");
            let form = document.querySelector("#form");
            newOpt.classList.add("relative");
            // newOpt.setAttribute("id", `${count}-id`)
    
            newOpt.innerHTML = `
            <input autocomplete="off" required id=input${count}-id name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Option" />
            <label for=input${count}-id class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Option ${count}</label>
            `
            form.appendChild(newOpt);
        }

        let dd = document.querySelector(`#input${count}-id`);
        let ww = dd.getAttribute("id");
        // if (dd) {

        //   console.log(dd.value)
        // }

       
        idList.push(ww)

        console.log(idList);
        console.log(count);
        
      })
      
      
    }
    
    if (pollBtn) {
      pollBtn.addEventListener('click', async (e) => {
    
      if (pollName.value === '' || pollName.value === null || optionOne.value === '' || optionOne.value === null || optionTwo.value === '' || optionTwo.value === null) {
        if (pollName.value === '' || pollName.value === null) {
    
          pollErrorOne.innerHTML = "*Poll name is required"
        } else {
          pollErrorOne.classList.add("hidden")
        }
      
        if (optionOne.value === '' || optionOne.value === null) {
      
          pollErrorTwo.innerHTML = "*This field is required"
        } else {
          pollErrorTwo.classList.add("hidden")
        }
        if (optionTwo.value === '' || optionTwo.value === null) {
      
          pollErrorThree.innerHTML = "*This field is required"
        } else {
          pollErrorThree.classList.add("hidden")
        }
      } else {
        pollPop.classList.add("hidden");
        pollPop.classList.remove("block");
        overlay.classList.add("hidden");
    
        try {

            const docRef = await addDoc(collection(db, "Events", eventPopId, "polls"), {
              pollName: pollName.value,
            });
              
            const subDocRef = await addDoc(collection(db, "Events", eventPopId, "polls", docRef.id, "options"), {
              pollOption: optionOne.value,
              voters: [],
              pollID: docRef.id,
            });

            const subbDocRef = await addDoc(collection(db, "Events", eventPopId, "polls", docRef.id, "options"), {
              pollOption: optionTwo.value,
              voters: [],
              pollID: docRef.id,
            });

            for (let i = 0; i< idList.length; i++) {
              let idd = document.getElementById(idList[i]).value;
              if (idd != "" && idd != null) {
                const subbDocRef = await addDoc(collection(db, "Events", eventPopId, "polls", docRef.id, "options"), {
                  pollOption: idd,
                  voters: [],
                  pollID: docRef.id,
                });
              }
              
            }

          alert("Poll Added Successfully")
          location.reload();
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    });
    }
  }

// List for Polls Page

let pollBlok = document.querySelector(".poll-block");

if (pollBlok) {

  let listInt = [];
  let listSum = [];
  
  const querySnapshotxxx = await getDocs(collection(db, "Events", eventPopId, "polls"));
  querySnapshotxxx.forEach(async(doc) => {
  
    const q = query(collection(db, "Events", eventPopId, "polls", doc.id, "options" ));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(docc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
  
      let optionVoters = docc.data().voters.length;
      listInt.push(optionVoters);
  
      
    });
    let sum = 0
    const s = listInt.reduce((partialSum, a) => partialSum + a, 0);
    listSum.push(s);
    listInt = []
    sum = 0;
  });
  let z = 0;
  
  
  const querySnapshotxx = await getDocs(collection(db, "Events", eventPopId, "polls"));
  querySnapshotxx.forEach(async(doc) => {
  
    let pollContainer = document.querySelector("#poll-container");
  
    if (pollContainer) {
  
      
      let pollBlock = document.createElement("div");
      
      pollBlock.setAttribute('id', `${doc.id}`);
      
      pollBlock.innerHTML = `
      
      <div class="up-click rounded-xl w-full grid grid-cols-12 bg-grey text-white shadow-xl p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform" href="#">
                        
      <!-- Icon -->
      <div class="col-span-12 md:col-span-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
      </div>
      
      <!-- Title -->
      <div class="col-span-11 xl: ml-6">
          <p class="text-blue-600 font-semibold"> ${doc.data().pollName} </p>
          </div>
          
          <!-- Description -->
          <a href="pollDetails.html" id="poption-${doc.id}" class="md:col-start-2 col-span-11 xl: ml-2">
  
          </a>
          <a href="pollEdit.html" id=edit-${doc.id} class="bg-black md:col-start-10 text-center col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Edit / Delete Poll</a>
          </div>
          
          `;
          
          pollContainer.appendChild(pollBlock);

          const q = query(collection(db, "Events", eventPopId, "polls", doc.id, "options"));
  
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async(docc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
  
            let popt = document.querySelector(`#poption-${doc.id}`);
            let optBar = document.createElement("div")
            optBar.setAttribute('class', 'my-2');
            optBar.setAttribute('id', `${docc.id}`);
  
            let percent = ((docc.data().voters.length / listSum[z]) * 100);
            percent = Math.round(percent)
  
            optBar.innerHTML = `
            <div class="w-full bg-navy rounded-full dark:bg-gray-700 relative">
              <p class="absolute text-sm text-center font-semibold text-poll overflow-ellipsis">${docc.data().pollOption} <br/> ${isNaN(percent)?0:percent}%</p>
              <div class="bg-blue text-xs font-medium text-white text-center p-5 leading-none rounded-full" style="width: ${isNaN(percent) || percent == 0 ?1:percent}%"></div>
            </div>
            `
            
            popt.appendChild(optBar);
            
          });
          
          z++
          if (pollBlock) {
            let pollIDs = pollBlock.getAttribute('id')
            pollBlock.addEventListener('click', () => {
              localStorage.setItem("poll ID", pollIDs);
            });
          }
    }
  });
}


var PollDocID = localStorage.getItem("poll ID");
//   console.log(PollDocID)

let pollDet = document.querySelector("#poll-detail");
  if (pollDet) {
    

    let listInt = [];
    let listSum = [];
    
    const querySnapshotxxx = await getDocs(collection(db, "Events", eventPopId, "polls"));
    querySnapshotxxx.forEach(async(doc) => {
    
      const q = query(collection(db, "Events", eventPopId, "polls", doc.id, "options" ));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async(docc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
    
        let optionVoters = docc.data().voters.length;
        listInt.push(optionVoters);
    
        
      });
      let sum = 0
      const s = listInt.reduce((partialSum, a) => partialSum + a, 0);
      listSum.push(s);
      listInt = []
      sum = 0;
    });
    let z = 0;



    const querySnapshot = await getDocs(collection(db, "Events", eventPopId, "polls"));
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots

      if (doc.id == PollDocID) {
        let pollNameDet = document.querySelector("#poll-name-det");
        pollNameDet.innerHTML = `${doc.data().pollName}`
        

        const q = query(collection(db, "Events", eventPopId, "polls", PollDocID, "options"));
  
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async(docc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
  
            let optBar = document.createElement("div")
            optBar.setAttribute('class', 'my-2');
            optBar.setAttribute('id', `${docc.id}`);
  
            let percent = ((docc.data().voters.length / listSum[z]) * 100);
            percent = Math.round(percent)
  
            optBar.innerHTML = `
            <div class="w-full bg-navy rounded-full relative my-10 flex items-center">
              <p class="absolute text-lg text-white text-center text-poll font-semibold">${docc.data().pollOption} <br/> ${isNaN(percent)?0:percent}%</p>
              <div class="bg-blue text-xs font-medium text-white text-center p-8 leading-none rounded-full" style="width: ${isNaN(percent) || percent == 0 ?1:percent}%"></div>
            </div>
            `
            
            pollDet.appendChild(optBar);
            
          });
          
          z++

      }
    });
  }




let chatRecentList = document.querySelector("#recent-list");
if (chatRecentList) {

  const q = query(collection(db, "Events", eventPopId, "users"), orderBy("datetime"));

const querySnapshoyt = await getDocs(q);
querySnapshoyt.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  // console.log(doc.id, " => ", doc.data());

    if (doc.id != adminID && doc.data().name != "Name") {
      let user = document.createElement("div");
      
      user.innerHTML = `
      

      <div id=${doc.id}>
        <a href="chatroom.html" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border transition-colors border-navy rounded-lg shadow hover:bg-grey">
        <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${doc.data().name}</h5>
        </a>
      </div>
      `

      if(user) {
        user.addEventListener('click', () => {
          localStorage.setItem("chatUser", `${doc.id}`);
        });
      }


      chatRecentList.appendChild(user)
    }
    
    
  });
}

let chatContactList = document.querySelector("#contact-list");
if (chatContactList) {

  const q = query(collection(db, "Events", eventPopId, "users"));

const querySnapshoyt = await getDocs(q);
querySnapshoyt.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  // console.log(doc.id, " => ", doc.data());

    if (doc.id != adminID && doc.data().name != "Name") {
      let user = document.createElement("div");
      user.innerHTML = `
      

      <div id=${doc.id}>
        <a href="chatroom.html" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border transition-colors border-navy rounded-lg shadow hover:bg-grey">
        <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${doc.data().name}</h5>
        </a>
      </div>
      `

      if(user) {
        user.addEventListener('click', () => {
          localStorage.setItem("chatUser", `${doc.id}`);
        });
      }


      chatContactList.appendChild(user)
    }
    
    
  });
}



var eventPopId = localStorage.getItem("event ID");
var chatUser = localStorage.getItem("chatUser");

let chatContainer = document.querySelector("#chat-msgs");
if (chatContainer) {
const qe = query(collection(db, "Events", eventPopId, "users", chatUser, "chats"), orderBy("datetime"));
const unsubscribe = onSnapshot(qe, (querySnapshot) => {
  chatContainer.innerHTML = ``;
  querySnapshot.forEach((doc) => {

      if (doc.data().senderId == adminID) {

        let msgSent = document.createElement("div");
        msgSent.setAttribute('class', 'flex justify-end mb-4 mr-4');
        msgSent.setAttribute('id', 'msg-sender');
        msgSent.innerHTML = `
        <div class="mr-2 py-3 px-4 bg-blue rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
          ${doc.data().text}
        </div>
        `
        chatContainer.appendChild(msgSent);
      } else if (doc.data().senderId == chatUser){

        let msgSent = document.createElement("div");
        msgSent.setAttribute('class', 'flex justify-start mb-4 ml-4');
        msgSent.setAttribute('id', 'msg-receiver');
        msgSent.innerHTML = `
        <div class="ml-2 py-3 px-4 bg-grey rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
          ${doc.data().text}
        </div>
        `
        chatContainer.appendChild(msgSent);
        
      }
      
      
    });
  });
}


let msgInput = document.querySelector("#msg-input");
let sendBtn = document.querySelector("#send-msg");
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {

    if (msgInput.value != "" || null) {
      await addDoc(collection(db, "Events", eventPopId, "users", chatUser, "chats"), {
        datetime: serverTimestamp(),
        reciverId: chatUser,
        senderId: adminID,
        text: msgInput.value
      });
      await addDoc(collection(db, "Events", eventPopId, "users", adminID, "chats"), {
        datetime: serverTimestamp(),
        reciverId: chatUser,
        senderId: adminID,
        text: msgInput.value
      });

      const chatRefDoc = doc(db, "Events", eventPopId, "users", chatUser);
      await updateDoc(chatRefDoc, {
        datetime: serverTimestamp()
      });

      const chatAdminDoc = doc(db, "Events", eventPopId, "users", adminID);
      await updateDoc(chatAdminDoc, {
        datetime: serverTimestamp()
      });

      window.scrollBy(0, 1000000);
      msgInput.value = ""
    }
  })
}


// Editing Polls :

let editForm = document.querySelector("#edit-form");

if (editForm) {


  let idList = [];
    let addOption = document.querySelector("#edit-add-opt-btn");
    if (addOption) {

      var count = 2;
      addOption.addEventListener('click', () => {
        count++;

        if (count>20){
          addOption.disabled = true;
          addOption.classList.add("hidden");
        } else {
          
            let newOpt = document.createElement("div");
            // let form = document.querySelector("#form");
            newOpt.classList.add("relative");
            // newOpt.setAttribute("id", `${count}-id`)
    
            newOpt.innerHTML = `
            <input autocomplete="off" required id=input${count}-id name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Option" />
            <label for=input${count}-id class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Option ${count}</label>
            `
            editForm.appendChild(newOpt);
        }

        let dd = document.querySelector(`#input${count}-id`);
        let ww = dd.getAttribute("id");
        // if (dd) {

        //   console.log(dd.value)
        // }

       
        idList.push(ww)

        console.log(idList);
        console.log(count);
        
      })
      
      
    }

  let pollIdEdit = [];

  const querySnapshot = await getDocs(collection(db, "Events", eventPopId, "polls"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());

    if (doc.id == PollDocID) {
      editForm.innerHTML = `
      <div class="relative">
        <input autocomplete="off" required id="edit-poll-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Poll Name" value="${doc.data().pollName}" />
        <label for="edit-poll-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Poll Name</label>
      </div>
      `
    }
  });


  const querySnapshotx = await getDocs(collection(db, "Events", eventPopId, "polls", PollDocID, "options"));
  querySnapshotx.forEach((doc) => {

    let optionInput = document.createElement('div');
    optionInput.setAttribute('class', "relative");
    optionInput.innerHTML = `
    <input autocomplete="off" required id="edit-input-${doc.id}" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Option" value="${doc.data().pollOption}"/>
    <label for="${doc.id}" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Option</label>
    `

    editForm.appendChild(optionInput);
    
    pollIdEdit.push(`${doc.id}`);

  });


  // Delete Poll:
  
  let deletePoll = document.querySelector("#delete-poll-btn");
  
  if (deletePoll) {
    deletePoll.addEventListener('click', async() => {
      
  
      if (window.confirm("Do you really want to delete this Poll?")) {
        try {
          await deleteDoc(doc(db, "Events", eventPopId, "polls", PollDocID));
          alert("Poll Deleted Successfully!")
          history.back();
        } catch (e){
          console.log(e)
        }
      }
    });
  }
  
  // *********
  
  let editPollName = document.querySelector("#edit-poll-name");
  let editPollBtn = document.querySelector("#edit-poll-btn");
  
  if (editPollName) {
    editPollBtn.addEventListener('click', async() => {

      if (editPollName.value == '' || editPollName.value == null) {
        alert("Poll name is required");
      } else {
        if (window.confirm("Confirm Edits ?")) {
          try {
          
            const pollEditRef = doc(db, "Events", eventPopId, "polls", PollDocID);
            await updateDoc(pollEditRef, {
              pollName: editPollName.value,
            });
    
            for (let i = 0; i < pollIdEdit.length; i++) {
    
              let optId = document.querySelector(`#edit-input-${pollIdEdit[i]}`)
    
              const pollEditOpt = doc(db, "Events", eventPopId, "polls", PollDocID, "options", pollIdEdit[i]);
    
              await updateDoc(pollEditOpt, {
                pollOption: optId.value || null,
              });
  
              
              
              if (optId.value == "" || optId.value == null) {
                await deleteDoc(pollEditOpt);
              }
            }
  
            for (let i = 0; i< idList.length; i++) {
              let idd = document.getElementById(idList[i]).value;
              if (idd != "" && idd != null) {
                await addDoc(collection(db, "Events", eventPopId, "polls", PollDocID, "options"), {
                  pollOption: idd,
                  voters: [],
                  pollID: PollDocID,
                });
              }
              
            }
    
            history.back();
          } catch (error) {
            console.error(error)
          }
        }

      }


    });
  }
};



const querySnapshoot = await getDocs(collection(db, "Events", eventPopId, "users"));
querySnapshoot.forEach(async(docx) => {

  let clkAddBtn = document.querySelector(`#CC-${docx.id}-addBtn`);

  if (clkAddBtn) {

    clkAddBtn.addEventListener('click', async() => {
      localStorage.setItem("chatUser", docx.id);
      let cc = localStorage.getItem("chatUser");
      // **********

      let addbtnPop = document.querySelector("#add-btn-pop");
    
      if (addbtnPop) {
      let optionPopUp = document.createElement("div");

      optionPopUp.innerHTML = `
      
      <div id="opt-event-pop" class="hidden items-center justify-center relative">
        <div  class=" flex fixed z-10 top-0 w-full h-full bg-navy bg-opacity-60 flex-col items-center ">
          <div id="add-btn-block" class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg grid gap-[1rem] grid-cols-4">
              
            <div id=${userID}-add-opt class="cursor-pointer">
              <div href="#" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-green border border-green rounded-lg shadow hover:bg-darkgreen">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">Add Option</h5>
              </div>
            </div>

          </div>
          <div class="relative mb-10">
            <button id="close-addUser-btn" class="bg-red hover:bg-black text-white rounded-md px-10 py-1">Close</button>
            <button id="edit-addUser-btn" class="bg-green hover:bg-black text-white rounded-md px-10 py-1 mx-2">Edit</button>
            <button id="hide-addUser-btn" class="bg-blue hover:bg-black text-white rounded-md px-10 py-1">Hide</button>
          </div>
        </div>
      </div>
      `
      addbtnPop.appendChild(optionPopUp);

        // *************
        
        const quu = query(collection(db, "Events", eventPopId, "users", cc, "userBtns"), where("userBtnID", "==", cc));
      
        const querySnapshottt = await getDocs(quu);
        querySnapshottt.forEach((ddoc) => {
          
          let addUserBtn = document.querySelector(`#${chatUser}-add-opt`)
          

          
          if (addUserBtn) {

            let newBtn = document.createElement("div");
          newBtn.setAttribute('class', "relative")

          if (ddoc.data().hidden == true) {
            newBtn.classList.add('opacity-30');
          }

          newBtn.innerHTML = `


          <a href="${ddoc.data().btnURL}" target="_self" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border border-navy rounded-lg shadow hover:bg-black">
            <h5 class="mb-2 text-2xl text-center text-btn font-bold tracking-tight text-white">${ddoc.data().btnName}</h5>
          </a>
          `
          addUserBtn.before(newBtn)


          let hideBtns = document.querySelector("#hide-addUser-btn");
          hideBtns.addEventListener('click', () => {

            if (ddoc.data().hidden == true) {
              newBtn.classList.add('opacity-30');
            }

            newBtn.innerHTML = `
            <div id="hide-${ddoc.id}" class="absolute -top-1 w-5 bg-white rounded-full -right-1 hover:bg-black transition-colors">
              <img src="./imgs/visibility-eye-svgrepo-com.svg" alt="close" class="cursor-pointer">
            </div>
              
            <div class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-black border border-black rounded-lg shadow">
              <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${ddoc.data().btnName}</h5>
            </div>
            `

            let hideIcon = document.querySelector(`#hide-${ddoc.id}`);

            hideIcon.addEventListener('click', async() => {
              
              newBtn.classList.toggle('opacity-30');


                const hideRef = doc(db, "Events", eventPopId, "users", cc, "userBtns", ddoc.id);
                await updateDoc(hideRef, {
                  hidden: newBtn.getAttribute('class') == "relative opacity-30",
                });

            });

          });


          let editBtns = document.querySelector("#edit-addUser-btn");
          
          editBtns.addEventListener('click', () => {

            if (ddoc.data().btnName != "Chats" && ddoc.data().btnName != "Polls" && ddoc.data().btnName != "Attendees") {

              newBtn.innerHTML = `
              <div id="delete-${ddoc.id}" class="absolute -top-1 w-5 bg-white rounded-full -right-1 hover:bg-black transition-colors">
                <img src="./imgs/close-red-icon.svg" alt="close" class="cursor-pointer">
              </div>
              <div id="edit-${ddoc.id}" class="absolute -top-1 p-[2px] w-5 bg-blue rounded-full right-6 hover:bg-darkblue transition-colors">
                <img src="./imgs/icons8-edit.svg" alt="close" class="cursor-pointer">
              </div>
                
                <div class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-black border border-black rounded-lg shadow">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${ddoc.data().btnName}</h5>
                </div>
                `
                let closeBtns = document.querySelector(`#delete-${ddoc.id}`)
                closeBtns.addEventListener('click', async() => {

                  if (window.confirm("Do you really want to delete this Button?")) {
                    try {
                      await deleteDoc(doc(db, "Events", eventPopId, "users", cc, "userBtns", ddoc.id));
                      alert("Button Deleted Successfully")
                      location.reload();
                    } catch (e){
                      console.log(e)
                    }
                  }

                });

                let editBtns = document.querySelector(`#edit-${ddoc.id}`)
                editBtns.addEventListener('click', async() => {

                  // **************

                  let editbtnpop = document.querySelector("#edit-btn-pop");
                  let editBtnPopUp = document.createElement("div");

                editBtnPopUp.innerHTML = `
                
                <div id="edit-btn-popup" class="hidden items-center justify-center relative">
                  <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
                    <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                        <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">

                        <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                          <div class="relative">
                            <input autocomplete="off" required id="edit-btn-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button Name" value="${ddoc.data().btnName}" />
                            <label for="edit-btn-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button Name</label>
                          </div>

                          <div id="btn-error-one"></div>

                          <div class="relative">
                            <input autocomplete="off" required pattern="https://.*" id="edit-btn-link" name="name" type="url" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button URL" value="${ddoc.data().btnURL}" />
                            <label for="edit-btn-link" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button URL</label>
                          </div>
                          

                          <div id="btn-error-two"></div>

                          <div class="relative">
                            <button id="edit-btn-click" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">add</button>
                            <button id="close-edit-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                          </div>
                        </div>

                        </div>
                    </div>
                  </div>
                </div>
                `
                editbtnpop.appendChild(editBtnPopUp);

                let overlay = document.querySelector(".overlay");
                let editBtnPopHidden = document.querySelector("#edit-btn-popup");
                editBtnPopHidden.classList.add("flex");
                editBtnPopHidden.classList.remove("hidden");
                overlay.classList.remove("hidden");

                let closeEventPop = document.querySelector("#close-edit-btn");
                if (closeEventPop) {
                  closeEventPop.addEventListener('click',() => {
                    editBtnPopHidden.classList.add("hidden");
                    editBtnPopHidden.classList.remove("flex");
                    overlay.classList.add("hidden");
                  });
                }


                let editBtnName = document.querySelector("#edit-btn-name");
                let editBtnURL = document.querySelector("#edit-btn-link");

                let editBtnClick = document.querySelector("#edit-btn-click");


                editBtnClick.addEventListener('click', async() => {

                  if (window.confirm("Confirm Edits ?")) {
                    try {
                    
                      const pollEditRef = doc(db, "Events", eventPopId, "users", cc, "userBtns", ddoc.id);
                      await updateDoc(pollEditRef, {
                        btnName: editBtnName.value,
                        btnURL: editBtnURL.value,
                      });
              
                      location.reload();
                    } catch (error) {
                      console.error(error)
                    }
                  }
                })


                  // **************

                });


            }


            })

          }

          

        });

        // *************


      let overlay = document.querySelector(".overlay");
      let optpopHidden = document.querySelector("#opt-event-pop");
      if (optpopHidden) {

        optpopHidden.classList.add("flex");
        optpopHidden.classList.remove("hidden");
        overlay.classList.remove("hidden");
      }

      let closeOptPop = document.querySelector("#close-addUser-btn");
      if (closeOptPop) {
        closeOptPop.addEventListener('click',() => {
          optionPopUp.remove()
          overlay.classList.add("hidden");
        });
      }

      let addbtn = document.querySelector(`#${userID}-add-opt`);
      if (addbtn) {
        addbtn.addEventListener('click',() => {

          let addbtnpop = document.querySelector("#add-btn-pop");
          let addBtnPopUp = document.createElement("div");

        addBtnPopUp.innerHTML = `
        
        <div id="add-btn-popup" class="hidden items-center justify-center relative">
          <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
            <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">

                <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <input autocomplete="off" required id="new-btn-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button Name" />
                    <label for="new-btn-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button Name</label>
                  </div>

                  <div id="btn-error-one"></div>

                  <div class="relative">
                    <input autocomplete="off" required pattern="https://.*" id="new-btn-link" name="name" type="url" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button URL" />
                    <label for="new-btn-link" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button URL</label>
                  </div>
                  

                  <div id="btn-error-two"></div>

                  <div class="relative">
                    <button id="user-btn-click" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">add</button>
                    <button id="close-event-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                  </div>
                </div>

                </div>
            </div>
          </div>
        </div>
        `
        addbtnpop.appendChild(addBtnPopUp);

        let overlay = document.querySelector(".overlay");
        let addBtnPopHidden = document.querySelector("#add-btn-popup");
        addBtnPopHidden.classList.add("flex");
        addBtnPopHidden.classList.remove("hidden");
        overlay.classList.remove("hidden");

        let closeEventPop = document.querySelector("#close-event-btn");
        if (closeEventPop) {
          closeEventPop.addEventListener('click',() => {
            addBtnPopHidden.classList.add("hidden");
            addBtnPopHidden.classList.remove("flex");
            overlay.classList.add("hidden");
          });
        }


        let eventNewBtn = document.querySelector("#user-btn-click");
      if (eventNewBtn) {
        eventNewBtn.addEventListener('click', async () => {

          let btnErrorOne = document.querySelector("#btn-error-one");
          let btnErrorTwo = document.querySelector("#btn-error-two");

          let newBtnName = document.querySelector("#new-btn-name");
          let newBtnLink = document.querySelector("#new-btn-link");

          if (newBtnName.value === '' || newBtnName.value === null || newBtnLink.value === '' || newBtnLink.value === null) {
            if (newBtnName.value === '' || newBtnName.value === null) {
        
              btnErrorOne.innerHTML = "*Button name is required"
            } else {
              btnErrorOne.classList.add("hidden")
            }
          
            if (newBtnLink.value === '' || newBtnLink.value === null) {
          
              btnErrorTwo.innerHTML = "*Button URL is required"
            } else {
              btnErrorTwo.classList.add("hidden")
            }
          } else {

            try {

              var eventPopId = localStorage.getItem("event ID");
              console.log(eventPopId)


              await addDoc(collection(db, "Events", eventPopId, "users", chatUser, "userBtns"), {
                btnName: newBtnName.value,
                btnURL: newBtnLink.value,
                userBtnID: userID,
                hidden: false,
              });

              addBtnPopHidden.classList.add("hidden");
              addBtnPopHidden.classList.remove("flex");
              alert("New Button Added!")
              location.reload();
            } catch(e) {
              console.log(e)
            }

          }
        });

      }

        });
        }

    }


      // **********

    });
  }


  

});

const querySnapshooot = await getDocs(collection(db, "Events", eventPopId, "users"));
querySnapshooot.forEach(async(docx) => {

  let clkAddBtn = document.querySelector(`#editAttend-${docx.id}`);

  if (clkAddBtn) {

    clkAddBtn.addEventListener('click', async() => {

      localStorage.setItem("chatUser", docx.id);
      let cc = localStorage.getItem("chatUser");
      // **********

      const querySnapshot = await getDocs(collection(db, "excelSheetMembers"));
      querySnapshot.forEach((docy) => {
        // doc.data() is never undefined for query doc snapshots
        
        if (docy.id === cc) {
          // console.log(doc.id, " => ", doc.data());
          let attendRow = document.querySelector(`#row-${docx.id}`)
          attendRow.innerHTML = `
          
          
          <td scope="row" class="px-3 py-4 font-medium text-white whitespace-nowrap">
            <button id=cancel-${docx.id}
              class="flex space-x-2 items-center px-4 py-2 bg-blue hover:bg-black rounded-full drop-shadow-md">
              <span class="text-white text-md">Cancel</span>
            </button>
          </td>
          <td id=name-${docx.id} scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap">
            <input required type="text" name="attend-name" id="attend-name-${docx.id}" value="${docy.data().Name}" class="text-black max-w-[110px] rounded-md h-4 p-4 overflow-ellipsis">
            <div id="user-error-one"></div>
          </td>
          <td id=sur-${docx.id} class="px-3 py-4">
          <input type="text" name="attend-sur" id="attend-sur-${docx.id}" value="${docy.data().Surname}" class="text-black max-w-[110px] rounded-md h-4 p-4 overflow-ellipsis">
          <div id="user-error-two"></div>
          </td>
          <td id=email-${docx.id} class="px-3 py-4">
          <input type="text" name="attend-email" id="attend-email-${docx.id}" value="${docy.data().email}" class="text-black max-w-[110px] rounded-md h-4 p-4 overflow-ellipsis">
          <div id="user-error-three"></div>
          </td>
          <td id=job-${docx.id} class="px-3 py-4">
          <input type="text" name="attend-job" id="attend-job-${docx.id}" value="${docy.data().jobTitle}" class="text-black max-w-[110px] rounded-md h-4 p-4 overflow-ellipsis">
          <div id="user-error-four"></div>
          </td>
          <td id=company-${docx.id} class="px-3 py-4">
          <input type="text" name="attend-company" id="attend-company-${docx.id}" value="${docy.data().Company}" class="text-black max-w-[110px] rounded-md h-4 p-4 overflow-ellipsis">
          <div id="user-error-five"></div>
          </td>
          <td id=country-${docx.id} class="px-3 py-4">
          <input type="text" name="attend-country" id="attend-country-${docx.id}" value="${docy.data().Country}" class="text-black max-w-[110px] rounded-md h-4 p-4 overflow-ellipsis">
          <div id="user-error-six"></div>
          </td>
          
          <td id=CC-${docx.id}-confirm class="px-1 py-4">
          <button id=confirm-${docx.id}
          class="flex w-full text-center justify-center space-x-2 items-center px-4 py-2 bg-green hover:bg-darkgreen rounded-full drop-shadow-md">
          <span class="text-white text-md">confirm</span>
          </button>
          </td>
          
          <td id=CC-${docx.id}-Delete class="px-1 py-4">
          <button id=Delete-${docx.id}
          class="flex w-full text-center justify-center space-x-2 items-center px-4 py-2 bg-red hover:bg-black rounded-full drop-shadow-md">
          <span class="text-white text-md">Delete</span>
          </button>
          </td>
          
          <td class="px-3 py-4">
          
          </td>
          `
          

          let cancelEdits = document.querySelector(`#cancel-${docx.id}`);

          if (cancelEdits) {
            cancelEdits.addEventListener('click', () => {

            location.reload();
            })

          }

          let confirmEdits = document.querySelector(`#CC-${docx.id}-confirm`);

          let attendName = document.querySelector(`#attend-name-${docx.id}`);
          let attendSur = document.querySelector(`#attend-sur-${docx.id}`);
          let attendEmail = document.querySelector(`#attend-email-${docx.id}`);
          let attendJob = document.querySelector(`#attend-job-${docx.id}`);
          let attendCompany = document.querySelector(`#attend-company-${docx.id}`);
          let attendCountry = document.querySelector(`#attend-country-${docx.id}`);


          let userErrorOne = document.querySelector("#user-error-one")
          let userErrorTwo = document.querySelector("#user-error-two")
          let userErrorThree = document.querySelector("#user-error-three")
          let userErrorFour = document.querySelector("#user-error-four")
          let userErrorFive = document.querySelector("#user-error-five")
          let userErrorSix = document.querySelector("#user-error-six")

          if (confirmEdits) {
            confirmEdits.addEventListener('click', async() => {

              if (attendName.value === '' || attendName.value === null ||attendSur.value === '' || attendSur.value === null || attendEmail.value === '' || attendEmail.value === null || attendJob.value === '' || attendJob.value === null || attendCompany.value === '' || attendCompany.value === null || attendCountry.value === '' || attendCountry.value === null) {
                if (attendName.value === '' || attendName.value === null) {
            
                  userErrorOne.innerHTML = "*Name is required"
                } else {
                  userErrorOne.classList.add("hidden")
                }
              
                if (attendSur.value === '' || attendSur.value === null) {
              
                  userErrorTwo.innerHTML = "*Surname is required"
                } else {
                  userErrorTwo.classList.add("hidden")
                }
              
                if (attendEmail.value === '' || attendEmail.value === null) {
              
                  userErrorThree.innerHTML = "*Email Address is required"
                } else {
                  userErrorThree.classList.add("hidden")
                }

                if (attendJob.value === '' || attendJob.value === null) {
              
                  userErrorFour.innerHTML = "*job title is required"
                } else {
                  userErrorFour.classList.add("hidden")
                }

                if (attendCompany.value === '' || attendCompany.value === null) {
              
                  userErrorFive.innerHTML = "*company name is required"
                } else {
                  userErrorFive.classList.add("hidden")
                }

                if (attendCountry.value === '' || attendCountry.value === null) {
              
                  userErrorSix.innerHTML = "*country is required"
                } else {
                  userErrorSix.classList.add("hidden")
                }
              } else {


                if (window.confirm("Confirm Edits ?")) {
                  try {
                    const confirmRefEvent = doc(db, "Events", eventPopId, "users", cc);
                    await updateDoc(confirmRefEvent, {
                      name: attendName.value,
                      surname: attendSur.value,
                    });
  
                    const confirmRefExcel = doc(db, "excelSheetMembers", cc);
                    await updateDoc(confirmRefExcel, {
                      Name: attendName.value,
                      Surname: attendSur.value,
                      email: attendEmail.value,
                      jobTitle: attendJob.value,
                      Company: attendCompany.value,
                      Country: attendCountry.value,
                    });
  
                  
                    location.reload();
                  } catch (error) {
                    console.error(error)
                  }
                }

              }


            })

          }


          let deleteEdits = document.querySelector(`#CC-${docx.id}-Delete`);

          if (deleteEdits) {
            deleteEdits.addEventListener('click', async() => {
              const docRef = doc(db, 'excelSheetMembers', cc);
              if (window.confirm("Do you really want to delete this User?")) {
                try {
                  await deleteDoc(doc(db, "Events", eventPopId, "users", cc));
                  const myList = docy.data().eventId;
                  const index = myList.indexOf(`${eventPopId}`);

                  if (index > -1) {
                    myList.splice(index, 1);
                  }
                  updateDoc(docRef, { eventId: myList })
                    .then(() => {
                      console.log('Document successfully updated!');
                    })
                    .catch((error) => {
                      console.error('Error updating document: ', error);
                    });
                  alert("User Deleted Successfully")
                  location.reload();
                } catch (e){
                  console.log(e)
                }
              }
            })

          }

        }

      });


      // **********

    });
  }


  

});


const querySnapshotyy = await getDocs(collection(db, "Events", eventPopId, "meetings"));
querySnapshotyy.forEach((docx) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(docx.id, " => ", docx.data());



  if (docx.data().Name != "Name" && "name") {

    let attendContainer = document.querySelector("#meeting-container");

    if (attendContainer) {
      let attendList = document.createElement("tbody");
      // attendList.setAttribute('class', `${doccc.id}`);

      attendList.innerHTML = `
      <tr id=row-${docx.id} class="bg-navy border-b border-grey">
        <td id=receiver-${docx.id} scope="row" class="px-6 py-4 overflow-ellipsis font-medium text-white whitespace-nowrap max-w-[160px]" style="overflow-wrap: break-word;">
            ${docx.data().receiver_username}
        </td>
        <td id=sender-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
          ${docx.data().sender_username}
        </td>
        <td id=table-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
            ${docx.data().TableNum}
        </td>
        <td id=date-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
            ${docx.data().Date}
        </td>
        <td id=status-${docx.id} class="px-3 py-4 max-w-[160px]" style="overflow-wrap: break-word;">
            
        </td>
      </tr>
      `
      attendContainer.appendChild(attendList);

      let status = document.querySelector(`#status-${docx.id}`);
      if(status) {
        if (docx.data().status === 0) {
          status.innerHTML = `<p class="text-yellow font-bold">Pending ...</p>`;
        } else if (docx.data().status === 1) {
          status.innerHTML = `<p class="text-yellow font-bold">Coordinator confirmation pending:</p>
          <div  class="flex flex-row justify-start items-center">
          <button id="accept-req-${docx.id}" type="button" class="focus:outline-none text-white bg-green hover:bg-darkgreen focus:ring-4 focus:ring-green font-medium rounded-lg text-sm px-5 py-2.5 mr-4 my-2">Accept</button>
          <button id="reject-req-${docx.id}" type="button" class="focus:outline-none text-white bg-red hover:bg-black focus:ring-4 focus:ring-red font-medium rounded-lg text-sm px-5 py-2.5 my-2">Reject</button>
          </div>`;
          // ConfirmOne.classList.remove('hidden');
          // ConfirmBtnsOne.classList.remove('hidden');
        } else if (docx.data().status === 2) {
          status.innerHTML = `<p class="text-yellow font-bold">User confirmation pending ...</p>
          `;
        } else if (docx.data().status === 3) {
          status.innerHTML = `<p class="text-green font-bold">User Accepted the invitation</p>
          <div class="flex flex-row justify-start items-center">
          <button id="confirm-req-${docx.id}" type="button" class="focus:outline-none text-white bg-green hover:bg-darkgreen focus:ring-4 focus:ring-green font-medium rounded-lg text-sm px-5 py-2.5 mr-4 my-2">Confirm</button>
          <button id="modify-req-${docx.id}" type="button" class="focus:outline-none text-white bg-blue hover:bg-darkblue focus:ring-4 focus:ring-blue font-medium rounded-lg text-sm px-5 py-2.5 my-2">Modifiy</button>
          </div>
          `;
        } else if (docx.data().status === 4) {
          status.innerHTML = `<p class="text-green font-bold">Accepted</p>`;
        } else if (docx.data().status === 5) {
          status.innerHTML = `<p class="text-red font-bold">Rejected</p>`;
        }

        let acceptRequest = document.querySelector(`#accept-req-${docx.id}`);
        let rejectRequest = document.querySelector(`#reject-req-${docx.id}`);
        if (acceptRequest) {

          acceptRequest.addEventListener('click', async () => {
            if (confirm("Are you sure you want to accept this invitation request?")) {
              await updateDoc(doc(db, "Events", eventPopId, "meetings", docx.id), {
                status: 2
              });

              const functions = getFunctions();
              const addMessage = httpsCallable(functions, 'sendNotifi');
              await addMessage({ 
                recieverId: docx.data().receiverID,
                message: 'has invited you to a meeting',
                title: `Meeting invite from ${docx.data().sender_username}`
              ,})
            }
            alert("Invitation accepted!");
            location.reload();
          });
        }

        if (rejectRequest) {

          rejectRequest.addEventListener('click', async () => {
            if (confirm("Are you sure you want to reject this invitation request?")) {
              await updateDoc(doc(db, "Events", eventPopId, "meetings", docx.id), {
                status: 5
              });
            }
            alert("Invitation rejected!");
            location.reload();
          });
        }


        let confirmRequest = document.querySelector(`#confirm-req-${docx.id}`);
        let modifyRequest = document.querySelector(`#modify-req-${docx.id}`);

        if (confirmRequest) {

          confirmRequest.addEventListener('click', async () => {
            if (confirm("Are you sure you want to confirm this invitation request?")) {
              await updateDoc(doc(db, "Events", eventPopId, "meetings", docx.id), {
                status: 4
              });
            }
            alert("Invitation confirmed!");
            location.reload();
          });
        }

        if (modifyRequest) {
          let modifyPop = document.querySelector("#modify-btn-pop");

          modifyRequest.addEventListener('click', async () => {
            modifyPop.innerHTML = `

            <div id="modify-Pop" class=" flex fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-60" style="overflow-y: overlay;">
              <div class="extraOutline p-12 bg-white w-[30%] max-w-[405px] bg-whtie m-auto rounded-lg">
            
                <div class="max-w-md mx-auto">
                  <div id="close-event-pop" class="hidden">×</div>
                  <div>
                    <h1 class="text-2xl font-semibold">Invite to Meeting</h1>
                  </div>
                  <div class="divide-y divide-gray-200">
                    <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div class="relative">
                        <label for="table-num" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Select Table Number:</label>

                        <select class="mt-4 border-black w-[20%]" name="table-num" id="table-num">
                        </select>
                      </div>

                      <div id="meeting-error-one"></div>

                      <div class="relative !my-6">
                        <label for="date-range" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Select Date Range:</label>

                        <select class="mt-4 border-black w-full" name="date-range" id="date-range">
                          
                        </select>
                      </div>
                      

                      <div id=meeting-error-two"></div>
                      
                    </div>
                    <div class="relative border-none">
                      <button id="modify-meeting-btn" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">Invite</button>
                      <button id="close-modify-btn" class="bg-red hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            `

            if (modifyPop) {

              let closeModifyPop = document.querySelector("#close-modify-btn");
              let InvitePop = document.querySelector("#modify-Pop");
      
              closeModifyPop.addEventListener('click', () => {
                InvitePop.remove()
                overlay.classList.add("hidden");
              });
    
              let TableNumSelect = document.querySelector("#table-num");
              let dateRangeSelect = document.querySelector("#date-range");
      
              const querySnapshot = await getDocs(collection(db, "Events"));
              querySnapshot.forEach((doc) => {
      
      
                if (doc.id === eventPopId) {
                  
                  for (let i = 0; i < doc.data().TableNum; i++) {
                    let tableNumOption = document.createElement("option");
      
                    tableNumOption.innerHTML = `
                      <option value="${i + 1}">${i + 1}</option>
                    `
                    TableNumSelect.appendChild(tableNumOption)
                  }
      
                  for (let i = 0; i < doc.data().Dates.length; i++) {
                    let dateRangeOption = document.createElement("option");
      
                    dateRangeOption.innerHTML = `
                      <option value="${doc.data().Dates[i]}">${doc.data().Dates[i]}</option>
                    `
                    dateRangeSelect.appendChild(dateRangeOption)
                  }
                }
      
              });
      
              let modifyMeetingBtn = document.querySelector("#modify-meeting-btn");
      
              modifyMeetingBtn.addEventListener('click', async() => {
                if (confirm("Are you sure you want to confirm this invitation request?")) {
                  await updateDoc(doc(db, "Events", eventPopId, "meetings", docx.id), {
                    TableNum: TableNumSelect.value,
                    Date: dateRangeSelect.value,
                    status: 4,
                  });
                }
                alert("Invitation confirmed!");
                location.reload();
              });
            }

          });
        }

      }

    }
  }

});