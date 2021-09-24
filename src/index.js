import "regenerator-runtime/runtime";
import './style.css'
import camera from './assets/img/Camera.svg'
import arrow from './assets/img/arrow_left.svg'
import help from './assets/img/help.svg'
import x from './assets/img/x.svg'
!function () {
  const firstScreen = `
  <div id="top">
    <div id="camera">
    <div class="content">
    <div class="camerabg"></div>
    </div>
    <div class="btn btn-upload" id="upload-btn">
      <img src="${camera}" alt="camera">
      <p class="title fs12">Upload</p>
    </div>
    </div>
    <div id="info">
      <p class="fs18 title">
        Ray-Ban 3545V
      </p>
      <img src=""/>
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
        <img src="" alt=" ">
        <p></p>
      </div>
      <div class="glass">
        <img src="" alt="  ">
        <p></p>
      </div>
      <div class="glass">
        <img src="" alt=" ">
        <p></p>
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
      <div class="camerabg">
        <video src=""></video>
      </div>
         <img class="mirrorglass" src="" alt=" ">
      </div>
      <div class="btn btn-upload" id="upload-btn">
        <img src="${camera}" alt="camera">
        <p class="title fs12">Upload</p>
      </div>
      `
  const secondScreen = `<div id="secondscreen">
    <div id="ssleft">
      <div id="camera">
      <div class="content">
        <div class="camerabg">
          <canvas></canvas>
        </div>
         <img draggable="false" ondrag="return false" ondragdrop="return false" ondragstart="return false"  class="eye x1" src="${x}" alt="x">
         <img draggable="false" ondrag="return false" ondragdrop="return false" ondragstart="return false"  class="eye x2" src="${x}" alt="x">
        </div>
        <div class="btn btn-upload">
        <img src="${camera}" alt="camera">
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
          <p class="backnav fs14 title"><img class="aleft" src="${arrow}" alt=" "> Back</p>
          <p class="title fs20">Adjust the Image</p>
          <ol class="fs14">
            <li>Drag the RED targets to the center of your eyes.</li>
            <li>Drag to reposition photo</li>
            <li>Set your PD, if you know it. <img class="help" src="${help}" alt="help">
            </li>
            <input min="30" type="number" class="fs14 pd" placeholder="62">
            <li>Adjust the photo with the controls.</li>
          </ol>
          <div class="photoSetting">
            <p>Photo size:</p>
            <input class="photosize" min="0" max="200" value="100" type="range">
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
    let mirrorglass = null
    await navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
      cameraEl.innerHTML = cameraScreen
      const uploadBtn = document.querySelector('#upload-btn')
      const videoEl = cameraEl.querySelector('video')
      if (!meta.img) {
        videoEl.srcObject = stream
        videoEl.play()
      } else {
        uploadBtn.children[1].textContent = 'Retake'
      }
      mirrorglass = document.querySelector('.mirrorglass')
      mirrorglass.src = currentGlass.mirror_frame
      mirrorglass.style.width = '100%'
      currentGlass.imageWidth = parseInt(getComputedStyle(mirrorglass).width)
      if (!meta.show) {
        mirrorglass.style.opacity = '0'
      } else {
        mirrorglass.style.opacity = '100'
      }
      uploadBtn.addEventListener('click', () => {
        if (!meta.img) {
          videoEl.pause()
          sScreen(ref, videoEl)
        } else {
          fScreen(ref)
        }
      })
    }).catch(err => {
      cameraEl.innerHTML = allowError
      errFlag = true
    })
    const glasses = document.querySelectorAll('.glass')
    glasses.forEach((glass, i) => {
      glass.children[0].src = serverData.items[i].image
      glass.children[1].textContent = serverData.items[i].name
      glass.dataset.glassidx = i
      glass.addEventListener('click', ev => {
        currentGlass = serverData.items[ev.target.closest('.glass').dataset.glassidx]
        serverData.items = serverData.items.filter(item => item.name !== currentGlass.name)
        serverData.items.push(currentGlass)
        currentGlass.imageWidth = parseInt(getComputedStyle(mirrorglass).width)
        mirrorglass.src = currentGlass.mirror_frame
        fScreen(ref)
      })
    })
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
      camerabg.style.backgroundImage = `url(${meta.img})`
      camerabg.style.backgroundSize = meta.photoScale + '%'
      camerabg.style.transform = `rotate(${meta.photoRotate}deg)`
    }
  }

  function sScreen(ref, video = null) {
    screen = 2
    ref.innerHTML = secondScreen

    const canvas = document.querySelector('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)

    ref.classList.remove('fs')

    moveEyeDots()

    const tryBtn = document.querySelector('.try-btn')
    const backBtn = document.querySelector('.backnav')
    const pSize = document.querySelector('.photosize')
    const pRotate = document.querySelector('.photorotate')
    pSize.style.background = 'linear-gradient(to right, black 0%, black ' + pSize.value / 200 * 100 + '%, #DEDEDE ' + pSize.value / 200 * 100 + '%, #DEDEDE 100%)'
    pRotate.style.background = 'linear-gradient(to right, black 0%, black ' + pRotate.value / 360 * 100 + '%, #DEDEDE ' + pRotate.value / 360 * 100 + '%, #DEDEDE 100%)'
    const camerabg = document.querySelector('.camerabg')
    const retakeBtn = document.querySelector('.btn-upload')
    let photoScale = 100, photoRotate = 0
    pSize.addEventListener('input', () => {
      pSize.style.background = 'linear-gradient(to right, black 0%, black ' + pSize.value / 200 * 100 + '%, #DEDEDE ' + pSize.value / 200 * 100 + '%, #DEDEDE 100%)'
      photoScale = pSize.value
      canvas.style.transform = `scale(${photoScale}%)`
    })
    pRotate.addEventListener('input', () => {
      pRotate.style.background = 'linear-gradient(to right, black 0%, black ' + pRotate.value / 360 * 100 + '%, #DEDEDE ' + pRotate.value / 360 * 100 + '%, #DEDEDE 100%)'
      photoRotate = pRotate.value
      camerabg.style.transform = `rotate(${photoRotate}deg)`
    })
    retakeBtn.addEventListener('click', () => {
      fScreen(ref)
    })
    tryBtn.addEventListener('click', () => {
      const {scale, x, y} = getScale()
      fScreen(ref, {scale, x, y, img: canvas.toDataURL(), show: true, photoRotate, photoScale})
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

    function moveEvent(type = 'mouse', client, target) {
      const delta = client.clientX - parseInt(getComputedStyle(target).left) - target.offsetWidth / 2
      const content = target.closest('.content')
      const maxWidth = content.offsetWidth
      const maxHeight = content.offsetHeight

      function move(e) {
        let resX, resY
        if (type === 'mouse') {
          resX = e.clientX - delta - client.target.offsetWidth / 2
          resY = e.clientY - client.target.offsetHeight
        } else {
          resX = e.touches[0].clientX - delta - client.target.offsetWidth / 2
          resY = e.touches[0].clientY - client.target.offsetHeight
        }
        if (resX >= 0 && resX <= maxWidth - target.offsetWidth) {
          target.style.left = resX + 'px'
        }
        if (resY >= 0 && resY <= maxHeight - target.offsetHeight) {
          target.style.top = resY + 'px'
        }
      }

      if (type === 'mouse') {
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', (e) => {
          document.removeEventListener('mousemove', move)
        })
      } else {
        document.addEventListener('touchmove', move)
        document.addEventListener('touchend', (e) => {
          document.removeEventListener('touchmove', move)
        })
      }
    }

    eyes.forEach(item => {
      item.addEventListener('mousedown', ev => {
        moveEvent('mouse', ev, ev.target)
      })
      item.addEventListener('touchstart', ev => {
        ev.preventDefault()
        moveEvent('touch', ev.touches[0], ev.target)
      })
    })
  }
}()
