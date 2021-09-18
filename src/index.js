// TODO: PHOTO FROM BACKGROUND TO IMG
// TODO: PHOTO SIZE & PHOTO ROTATION

!function() {
  const firstScreen = `
  <div id="top">
    <div id="camera">
      <img class="mirrorglass" src="../assets/img/mirrortmp2.png" alt="mirror">
      <div class="btn btn-upload">
        <img src="../assets/img/Camera.svg" alt="camera">
        <p class="title fs12">Upload</p>
      </div>
    </div>
    <div id="info">
      <p class="fs18 title">
        Ray-Ban 3545V
      </p>
      <img src="../assets/img/tmp.jpg"/>
      <div class="title fs16 btn">
        Choose Lenses
      </div>
      <div class="descr">
        <p class="title fs16">
          Product Description
        </p>
        <p class="fulldescr fs12">
          The Ray-Ban 5228 is the slimmer take on the iconic wayframe.
          Crafted from premium acetate, its sleek arms, silver accents and
          rich hue continues to leave a mark now just as it did in the early 1950’s.
        </p>
      </div>
    </div>
  </div>
  <div id="similar">
    <p class="title fs16">Similar Frames</p>
    <div class="glasses">
      <div class="glass">
        <img src="../assets/img/tmp.jpg" alt="glass">
        <p>Ray-Ban 3545V</p>
      </div>
      <div class="glass">
        <img src="../assets/img/tmp.jpg" alt="glass">
        <p>Ray-Ban 3545V</p>
      </div>
      <div class="glass">
        <img src="../assets/img/tmp.jpg" alt="glass">
        <p>Ray-Ban 3545V</p>
      </div>
    </div>
  </div>
`
  const allowError = `
        <div class="text">
          <p class="fs18 title caccess">
            Allow camera access
          </p>
          <p class="fs14">
            We ask you to enable camera access so you can start trying on glasses.
          </p>
        </div>`
  const cameraScreen = `
         <img class="mirrorglass" src="../assets/img/mirrortmp3.png" alt="mirror">
      <div class="btn btn-upload" id="upload-btn">
        <img src="../assets/img/Camera.svg" alt="camera">
        <p class="title fs12">Upload</p>
      </div>`
  const secondScreen = `<div id="secondscreen">
    <div id="ssleft">
      <div id="camera">
         <img draggable="false" class="eye x1" src="../assets/img/x.svg" alt="x">
         <img draggable="false" class="eye x2" src="../assets/img/x.svg" alt="x">
        <div class="btn btn-upload">
          <img src="../assets/img/Camera.svg" alt="camera">
          <p class="title fs12">Retake</p>
        </div>
      </div>
      <div class="btns">
        <div class="fs16 btn title try-btn">Try On Glasses</div>
        <a class="fs14 title">Reset Adjastments</a>
      </div>
    </div>
    <div id="ssright">
      <div id="info" class="ssInfo">
        <div>
          <p class="backnav fs14 title"><img class="aleft" src="../assets/img/arrow_left.svg" alt=""> Back</p>
          <p class="title fs20">Adjust the Image</p>
          <ol class="fs14">
            <li>Drag the RED targets to the center of your eyes.</li>
            <li>Drag to reposition photo</li>
            <li>Set your PD, if you know it. <img class="help" src="../assets/img/help.svg" alt="help">
            </li>
            <input min="30" type="number" class="fs14 pd" placeholder="62">
            <li>Adjust the photo with the controls.</li>
          </ol>
          <div class="photoSetting">
            <p>Photo size:</p>
            <input class="photosize" type="range">
            <p>Photo rotation:</p>
            <input class="photorotate" type="range">
          </div>

        </div>

      </div>
    </div>
  </div>`
  let screen = 1
  addEventListener('DOMContentLoaded', async () => {
    await init()
  })
  async function init() {
    const ref = document.getElementById('virtual-mirror-widget')
    if (!ref) {
      console.error("ERROR: No element with 'virtual-mirror-widget' id")
      return
    }
    await fScreen(ref)
  }

  async function fScreen(ref, meta = {}) {
    screen = 1
    ref.innerHTML = firstScreen
    ref.classList.add('fs')
    let errFlag = false
    const cameraEl = document.querySelector("#camera")
    await navigator.mediaDevices.getUserMedia({audio: true}).then(item => {
      cameraEl.innerHTML = cameraScreen
      const uploadBtn = document.querySelector('#upload-btn')
      uploadBtn.addEventListener('click', () => {
        sScreen(ref)
      })
    }).catch(err => {
      cameraEl.innerHTML = allowError
      errFlag = true
    })
    if (errFlag) {
      document.querySelector('#camera').style.background = "#F6F6F6"
    }
    if(meta){
      const glass = document.querySelector('.mirrorglass')
      glass.style.transform = `size(${meta.scale})`
      glass.style.left = meta.x + 'px'
      glass.style.top = meta.y + 'px'
    }
  }

  function sScreen(ref) {
    screen = 2
    ref.innerHTML = secondScreen
    ref.classList.remove('fs')
    moveEyeDots()
    const tryBtn = document.querySelector('.try-btn')
    const backBtn = document.querySelector('.backnav')
    tryBtn.addEventListener('click', () => {
      const frameWidth = 135
      const frameImageWidth = 172
      const pd = (() => {
        const input = document.querySelector('.pd')
        if(input.value){
          if(input.value < 30) {
            return 30
        }
          return input.value
        }
        return 62
      })()
      let x = 0, y = 0
      const distanceBetweenPupilsMarks = (() => {
        const eyes = document.querySelectorAll('.eye')
        x = eyes[0].x
        y = eyes[0].y - eyes[0].height / 2
        return eyes[1].x - eyes[0].x
      })()
      const scale = (frameWidth / frameImageWidth) / (pd / distanceBetweenPupilsMarks)
      x -= (frameImageWidth * scale - distanceBetweenPupilsMarks * scale ) / 2
      fScreen(ref, {scale, x,y})
    })
    backBtn.addEventListener('click', () => {
      fScreen(ref)
    })
  }
  function moveEyeDots() {
    const eyes = document.querySelectorAll('.eye')
    eyes.forEach(item => {
      item.addEventListener("mousedown", ev => {
        const delta = ev.clientX - ev.target.x- ev.target.offsetWidth / 2;
        function move(e){
          ev.target.style.left = e.clientX - delta - ev.target.offsetWidth / 2  + 'px'
          ev.target.style.top = e.clientY - ev.target.offsetHeight  + 'px'
        }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', (e) => {
          document.removeEventListener('mousemove', move)
        })
      })
    })
  }
}()

// fetch('https://optimaxdev.github.io/volga-it/response.json')
//     .then(res => res.json())
//     .then(data => {
//       console.log(data)
//     })

