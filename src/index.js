// TODO: fix govnocode
// TODO: select glass from similar

!function () {
  const firstScreen = `
  <div id="top">
    <div id="camera">
    <div class="content">
    <div class="camerabg"></div>
    </div>
    <div class="btn btn-upload" id="upload-btn">
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
  <div id="camerabg"></div>
        <div class="text">
          <p class="fs18 title caccess">
            Allow camera access
          </p>
          <p class="fs14">
            We ask you to enable camera access so you can start trying on glasses.
          </p>
        </div>`
  const cameraScreen = `
      <div class="content">
      <div class="camerabg"></div>
         <img class="mirrorglass" src="../assets/img/mirrortmp3.png" alt="mirror">
      </div>
      <div class="btn btn-upload" id="upload-btn">
        <img src="../assets/img/Camera.svg" alt="camera">
        <p class="title fs12">Upload</p>
      </div>
      `
  const secondScreen = `<div id="secondscreen">
    <div id="ssleft">
      <div id="camera">
      <div class="content">
        <div class="camerabg"></div>
         <img draggable="false" class="eye x1" src="../assets/img/x.svg" alt="x">
         <img draggable="false" class="eye x2" src="../assets/img/x.svg" alt="x">
        </div>
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
            <input class="photosize" min="50" max="200" value="100" type="range">
            <p>Photo rotation:</p>
            <input class="photorotate" min="0" max="360" value="0" type="range">
          </div>

        </div>

      </div>
    </div>
  </div>`
  let screen = 1
  let serverData = {}
  let currentGlass = {}
  addEventListener('DOMContentLoaded', async () => {
    await init()
  })

  async function init() {
    const ref = document.getElementById('virtual-mirror-widget')
    if (!ref) {
      console.error('ERROR: No element with \'virtual-mirror-widget\' id')
      return
    }
    try {
      const res = await fetch('https://optimaxdev.github.io/volga-it/response.json')
      serverData = await res.json()
      currentGlass = serverData.items[3]
    } catch (e) {
      console.error(e.message)
    }
    await fScreen(ref)
  }

  async function fScreen(ref, meta = {}) {
    screen = 1
    ref.innerHTML = firstScreen
    ref.classList.add('fs')
    let errFlag = false
    const cameraEl = document.querySelector('#camera')
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
    const glasses = document.querySelectorAll('.glass')
    glasses.forEach((glass, i) => {
      if (glass.name === currentGlass.name) ++i
      glass.children[0].src = serverData.items[i].image
      glass.children[1].textContent = serverData.items[i].name
      glass.dataset.glassidx = i
      glass.addEventListener('click', ev => {
        currentGlass = serverData.items[ev.target.closest('.glass').dataset.glassidx]
        currentGlass.imageWidth = parseInt(getComputedStyle(mirrorglass).width)
        mirrorglass.src = currentGlass.mirror_frame
        sScreen(ref)
      })
    })
    const mirrorglass = document.querySelector('.mirrorglass')
    mirrorglass.src = currentGlass.mirror_frame
    currentGlass.imageWidth = parseInt(getComputedStyle(mirrorglass).width)
    document.querySelector('#info .title').textContent = currentGlass.name
    document.querySelector('#info img').src = currentGlass.image
    document.querySelector('#info .fulldescr').textContent = currentGlass.description
    if (errFlag) {
      document.querySelector('#camerabg').style.background = '#F6F6F6'
    }
    if (Object.keys(meta).length !== 0) {
      const glass = document.querySelector('.mirrorglass')
      glass.style.transform = `scale(${meta.scale}, ${meta.scale})`
      glass.style.left = meta.x + 'px'
      glass.style.top = meta.y + 'px'
      const camerabg = document.querySelector('.camerabg')
      camerabg.style.backgroundSize = meta.photoScale + '%'
      camerabg.style.transform = `rotate(${meta.photoRotate}deg)`
    }
  }

  function sScreen(ref) {
    screen = 2
    ref.innerHTML = secondScreen
    ref.classList.remove('fs')
    moveEyeDots()
    const tryBtn = document.querySelector('.try-btn')
    const backBtn = document.querySelector('.backnav')
    const pSize = document.querySelector('.photosize')
    const pRotate = document.querySelector('.photorotate')
    const camerabg = document.querySelector('.camerabg')
    let photoScale = 100, photoRotate = 0
    pSize.addEventListener('input', () => {
      photoScale = pSize.value
      camerabg.style.backgroundSize = photoScale + '%'
    })
    pRotate.addEventListener('input', () => {
      photoRotate = pRotate.value
      camerabg.style.transform = `rotate(${photoRotate}deg)`
    })
    tryBtn.addEventListener('click', () => {
      const {scale, x, y} = getScale()
      fScreen(ref, {scale, x, y})
    })
    backBtn.addEventListener('click', () => {
      fScreen(ref)
    })

  }

  function getScale() {
    const frameWidth = currentGlass.width
    const frameImageWidth = currentGlass.imageWidth
    const pd = (() => {
      const input = document.querySelector('.pd')
      if (input.value) {
        if (input.value < 30) {
          return 30
        }
        return input.value
      }
      return 62
    })()
    let x = 0, y = 0
    const distanceBetweenPupilsMarks = (() => {
      const eyes = document.querySelectorAll('.eye')
      x = parseInt(getComputedStyle(eyes[0]).left) + parseInt(getComputedStyle(eyes[0]).width) / 2
      y = parseInt(getComputedStyle(eyes[0]).top) - parseInt(getComputedStyle(eyes[0]).height) / 3
      return parseInt(getComputedStyle(eyes[1]).left) - parseInt(getComputedStyle(eyes[0]).left)
    })()
    const scale = (frameWidth / frameImageWidth) / (pd / distanceBetweenPupilsMarks)
    x -= (frameImageWidth * scale - distanceBetweenPupilsMarks) / 2
    return {scale, x, y}
  }

  function moveEyeDots() {
    const eyes = document.querySelectorAll('.eye')
    eyes.forEach(item => {
      item.addEventListener('mousedown', ev => {
        const delta = ev.clientX - parseInt(getComputedStyle(ev.target).left) - ev.target.offsetWidth / 2

        function move(e) {
          ev.target.style.left = e.clientX - delta - ev.target.offsetWidth / 2 + 'px'
          ev.target.style.top = e.clientY - ev.target.offsetHeight + 'px'
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', (e) => {
          document.removeEventListener('mousemove', move)
        })
      })
    })
  }
}()
