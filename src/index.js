!function() {
  let firstScreen = `
  <div id="top">
    <div id="camera">
      <img class="mirrorglass" src="../assets/img/mirrotmp.png" alt="mirror">
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
         <img class="mirrorglass" src="../assets/img/mirrotmp.png" alt="mirror">
      <div class="btn btn-upload" id="upload-btn">
        <img src="../assets/img/Camera.svg" alt="camera">
        <p class="title fs12">Upload</p>
      </div>`
  const otherPart = `
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
  </div>`
  addEventListener('DOMContentLoaded', async () => {
    await init()
    const uploadBtn = document.querySelector('#upload-btn')
    uploadBtn.addEventListener('click', () => {

    })
  })
  async function init() {
    const ref = document.getElementById('virtual-mirror-widget')
    if (!ref) {
      console.error("ERROR: No element with 'virtual-mirror-widget' id")
      return
    }
    ref.innerHTML = firstScreen
    firstScreen = ` <div id="top"> 
                  <div id="camera">`
    let errFlag = false
    await navigator.mediaDevices.getUserMedia({audio: true}).then(item => {
      firstScreen += cameraScreen
    }).catch(err => {
      firstScreen += allowError
      errFlag = true;
    })
    firstScreen += otherPart
    ref.innerHTML = firstScreen
    if (errFlag) {
      document.querySelector('#camera').style.background = "#F6F6F6"
    }
  }

}()

// fetch('https://optimaxdev.github.io/volga-it/response.json')
//     .then(res => res.json())
//     .then(data => {
//       console.log(data)
//     })