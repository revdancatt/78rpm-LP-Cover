/* global fxrand fxhash originalFeatures noise $fx fxpreview paper1Loaded preloadImagesTmr */

//
//  78rpm LP Cover - revdancatt 13/09/2023
//
//
//  HELLO!! Code is copyright revdancatt (that's me), so no sneaky using it for your
//  NFT projects.
//  But please feel free to unpick it, and ask me questions. A quick note, this is written
//  as an artist, which is a slightly different (and more storytelling way) of writing
//  code, than if this was an engineering project. I've tried to keep it somewhat readable
//  rather than doing clever shortcuts, that are cool, but harder for people to understand.
//
//  You can find me at...
//  https://twitter.com/revdancatt
//  https://instagram.com/revdancatt
//  https://youtube.com/revdancatt
//
// Global values, because today I'm being an artist not an engineer!
const ratio = 1 // canvas ratio
const features = {} //  so we can keep track of what we're doing
const nextFrame = null // requestAnimationFrame, and the ability to clear it
let resizeTmr = null // a timer to make sure we don't resize too often
let highRes = false // display high or low res
let drawStarted = false // Flag if we have kicked off the draw loop
let thumbnailTaken = false
let forceDownloaded = false
const urlSearchParams = new URLSearchParams(window.location.search)
const urlParams = Object.fromEntries(urlSearchParams.entries())
const prefix = '78rpm-LP-Cover'
// dumpOutputs will be set to false unless we have ?dumpOutputs=true in the URL
const dumpOutputs = urlParams.dumpOutputs === 'true'
const startTime = new Date().getTime()
let full = false

//  We need this to display features
window.$fxhashFeatures = {}

const makeFeatures = () => {
  // const { label, coloured, bpm } = originalFeatures[iterations - 1]
  const primaryColours = {
    England: {
      shade: '#65041E',
      dark: '#AB0733',
      medium: '#BD0419',
      light: '#FC0000'
    },
    Wales: {
      shade: '#6B2D12',
      dark: '#F78D00',
      medium: '#E8A730',
      light: '#F1D726'
    },
    Scotland: {
      shade: '#212F80',
      dark: '#4630CD',
      medium: '#3633DD',
      light: '#5771FF'
    },
    Ireland: {
      shade: '#21803C',
      dark: '#008C28',
      medium: '#00B441',
      light: '#78D100'
    },
    Vapor: {
      shade: '#000000',
      dark: '#56027A',
      medium: '#B402B7',
      light: '#E954E0'
    },
    Desolate: {
      shade: '#5B5534',
      dark: '#5B5534',
      medium: '#7F734B',
      light: '#A69A72'
    },
    Ice: {
      shade: '#CFE7F4',
      dark: '#769AAF',
      medium: '#9AB5C4',
      light: '#CFE7F4'
    }
  }

  // features.background = 1
  features.paperOffset = {
    paper1: {
      x: fxrand(),
      y: fxrand()
    },
    paper2: {
      x: fxrand(),
      y: fxrand()
    }
  }
  const maxIterations = originalFeatures.length
  // const iterations = $fx.iteration === undefined ? Math.floor(fxrand() * maxIterations) + 1 : $fx.iteration

  // For testing
  const iterations = Math.floor(fxrand() * maxIterations) + 1
  // deconstruct the entry in the originalFeatures array into the existing features object
  const { label, coloured, bpm } = originalFeatures[iterations - 1]
  features.label = label
  features.coloured = coloured
  features.bpm = bpm

  features.primaryColours = primaryColours[label.split('/')[0]]
  features.secondaryColours = primaryColours[label.split('/')[1]]

  // Now we are going to grid the cover up into a 16 x 16 grid
  // Then randomnly assign each square a colour from the primary colours
  features.scuffs = []
  for (let i = 0; i < 24; i++) {
    features.scuffs.push({
      size: fxrand() * 0.05 + 0.05,
      start: fxrand() * Math.PI * 2,
      roation: fxrand() * Math.PI * 2,
      xOffset: fxrand() - 0.5,
      yOffset: fxrand() - 0.5
    })
  }
}

// Call makeFeatures() right away, because we want to do this as soon as possible
makeFeatures()
console.log(features)
console.table(window.$fxhashFeatures)

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//
// Custom drawing code goes here. By this point everything that will be drawn
// has been decided, so we just need to draw it.
//
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//  This is where we bring it all together
const drawCanvas = async () => {
  drawStarted = true
  const canvas = document.getElementById('target')
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  //  Lay down the first paper texture
  ctx.fillStyle = features.paper1Pattern

  ctx.save()
  ctx.translate(-w * features.paperOffset.paper1.x, -h * features.paperOffset.paper1.y)
  ctx.fillRect(0, 0, w * 2, h * 2)
  ctx.restore()

  //  Lay down the second paper texture
  ctx.globalCompositeOperation = 'darken'
  ctx.fillStyle = features.paper2Pattern

  ctx.save()
  ctx.translate(-w * features.paperOffset.paper1.x, -h * features.paperOffset.paper1.y)
  ctx.fillRect(0, 0, w * 2, h * 2)
  ctx.restore()

  ctx.globalCompositeOperation = 'source-over'

  // Now we are going to fill the album cover in black
  ctx.save()

  // If we are not full screen, then we need to scale and translate the canvas
  if (!full) {
    const mod = 0.68
    const leftOffset = (w - (w * mod)) / 2
    const topOffset = (h - (h * mod)) / 7 * 3
    ctx.translate(leftOffset, topOffset)
    ctx.scale(mod, mod)
  }

  // put a clip mask around the whole thing
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, w, h)
  ctx.clip()

  // Do the background
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = '#D8C49E'
  ctx.fillRect(0, 0, w, h)

  // now add the label colours
  // Make a gradient from top to bottom, that runs through the colours
  ctx.globalAlpha = 0.75
  const grd = ctx.createLinearGradient(0, 0, 0, h)
  grd.addColorStop(0, features.secondaryColours.shade)
  grd.addColorStop(0.33, features.secondaryColours.dark)
  grd.addColorStop(0.66, features.secondaryColours.medium)
  grd.addColorStop(1.00, features.secondaryColours.light)
  ctx.fillStyle = grd
  ctx.fillRect(w * 0.1, 0, w * 0.15, h)

  // ctx.globalCompositeOperation = 'source-over'
  // Set the global alpha
  ctx.globalAlpha = 0.75

  // Write the words
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  const labelMiddle = w * 0.1 + w * 0.15 / 2
  ctx.font = `${w * 0.13 * 0.2}px FCBold`
  ctx.fillText('MNML Ser I', labelMiddle, h * 0.89)

  // Write the 78RPM
  ctx.font = `${w * 0.13 * 0.28}px FBold`
  ctx.fillText('78RPM', labelMiddle, h * 0.925)

  ctx.font = `${w * 0.13 * 0.19}px FCBold`
  ctx.fillText('SIDE 1: 2:30', labelMiddle, h * 0.95)

  ctx.font = `${w * 0.13 * 0.25}px FBold`
  ctx.fillText(`${features.bpm}BPM`, labelMiddle, h * 0.98)

  ctx.globalCompositeOperation = 'screen'

  // Now we want to add "scuff" marks to the cover from the vinyl being inside
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  // Draw a circle, right in the middle
  // Loop round the scuffs
  features.scuffs.forEach(scuff => {
    //
    ctx.beginPath()
    ctx.arc(w / 2 + (scuff.xOffset * w / 50), h / 2 + (scuff.yOffset * h / 50), w * 0.47, scuff.start, scuff.start * scuff.size)
    ctx.stroke()
  })

  ctx.globalCompositeOperation = 'source-over'

  // Remove the clip mask
  ctx.restore()

  // If we are not fullscreen we want to add a shadow
  if (!full) {
    const grd = ctx.createLinearGradient(0, h, 0, h + h * 0.1 * (1 / 0.68))
    grd.addColorStop(0, 'rgba(0, 0, 0, 0.666)')
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, h, w, h + h * 0.1 * (1 / 0.68))
  }
  ctx.restore()
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //
  // Below is code that is common to all the projects, there may be some
  // customisation for animated work or special cases

  // Try various methods to tell the parent window that we've drawn something
  if (!thumbnailTaken) {
    try {
      $fx.preview()
    } catch (e) {
      try {
        fxpreview()
      } catch (e) {
      }
    }
    thumbnailTaken = true
  }

  // If we are forcing download, then do that now
  if (dumpOutputs || ('forceDownload' in urlParams && forceDownloaded === false)) {
    forceDownloaded = 'forceDownload' in urlParams
    await autoDownloadCanvas()
    // Tell the parent window that we have downloaded
    window.parent.postMessage('forceDownloaded', '*')
  } else {
    //  We should wait for the next animation frame here
    // nextFrame = window.requestAnimationFrame(drawCanvas)
  }
  //
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//
// These are the common functions that are used by the canvas that we use
// across all the projects, init sets up the resize event and kicks off the
// layoutCanvas function.
//
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//  Call this to start everything off
const init = async () => {
  // Resize the canvas when the window resizes, but only after 100ms of no resizing
  window.addEventListener('resize', async () => {
    //  If we do resize though, work out the new size...
    clearTimeout(resizeTmr)
    resizeTmr = setTimeout(async () => {
      await layoutCanvas()
    }, 100)
  })

  //  Now layout the canvas
  await layoutCanvas()
}

//  This is where we layout the canvas, and redraw the textures
const layoutCanvas = async (windowObj = window, urlParamsObj = urlParams) => {
  //  Kill the next animation frame (note, this isn't always used, only if we're animating)
  windowObj.cancelAnimationFrame(nextFrame)

  //  Get the window size, and devicePixelRatio
  const { innerWidth: wWidth, innerHeight: wHeight, devicePixelRatio = 1 } = windowObj
  let dpr = devicePixelRatio
  let cWidth = wWidth
  let cHeight = cWidth * ratio

  if (cHeight > wHeight) {
    cHeight = wHeight
    cWidth = wHeight / ratio
  }

  // Grab any canvas elements so we can delete them
  const canvases = document.getElementsByTagName('canvas')
  Array.from(canvases).forEach(canvas => canvas.remove())

  // Now set the target width and height
  let targetHeight = highRes ? 4096 : cHeight
  let targetWidth = targetHeight / ratio

  //  If the alba params are forcing the width, then use that (only relevant for Alba)
  if (windowObj.alba?.params?.width) {
    targetWidth = window.alba.params.width
    targetHeight = Math.floor(targetWidth * ratio)
  }

  // If *I* am forcing the width, then use that, and set the dpr to 1
  // (as we want to render at the exact size)
  if ('forceWidth' in urlParams) {
    targetWidth = parseInt(urlParams.forceWidth)
    targetHeight = Math.floor(targetWidth * ratio)
    dpr = 1
  }

  // Update based on the dpr
  targetWidth *= dpr
  targetHeight *= dpr

  //  Set the canvas width and height
  const canvas = document.createElement('canvas')
  canvas.id = 'target'
  canvas.width = targetWidth
  canvas.height = targetHeight
  document.body.appendChild(canvas)

  canvas.style.position = 'absolute'
  canvas.style.width = `${cWidth}px`
  canvas.style.height = `${cHeight}px`
  canvas.style.left = `${(wWidth - cWidth) / 2}px`
  canvas.style.top = `${(wHeight - cHeight) / 2}px`

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //
  // Custom code (for defining textures and buffer canvas goes here) if needed
  //
  //  Re-Create the paper pattern
  const paper1 = document.createElement('canvas')
  paper1.width = canvas.width / 2
  paper1.height = canvas.height / 2
  const paper1Ctx = paper1.getContext('2d')
  await paper1Ctx.drawImage(paper1Loaded, 0, 0, 1920, 1920, 0, 0, paper1.width, paper1.height)
  features.paper1Pattern = paper1Ctx.createPattern(paper1, 'repeat')

  //
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  //  And draw it!!
  drawCanvas()
}

//  This allows us to download the canvas as a PNG
// If we are forcing the id then we add that to the filename
const autoDownloadCanvas = async () => {
  const canvas = document.getElementById('target')

  // Create a download link
  const element = document.createElement('a')
  const filename = 'forceId' in urlParams
    ? `${prefix}_${urlParams.forceId.toString().padStart(4, '0')}_${fxhash}`
    : `${prefix}_${fxhash}`
  element.setAttribute('download', filename)

  // Hide the link element
  element.style.display = 'none'
  document.body.appendChild(element)

  // Convert canvas to Blob and set it as the link's href
  const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  element.setAttribute('href', window.URL.createObjectURL(imageBlob))

  // Trigger the download
  element.click()

  // Clean up by removing the link element
  document.body.removeChild(element)

  // Reload the page if dumpOutputs is true
  if (dumpOutputs) {
    window.location.reload()
  }
}
//  KEY PRESSED OF DOOM
document.addEventListener('keypress', async (e) => {
  e = e || window.event
  // == Common controls ==
  // Save
  if (e.key === 's') autoDownloadCanvas()

  //   Toggle highres mode
  if (e.key === 'h') {
    highRes = !highRes
    console.log('Highres mode is now', highRes)
    await layoutCanvas()
  }

  // Custom controls
  if (e.key === 'f') {
    full = !full
    await layoutCanvas()
  }
})

//  This preloads the images so we can get access to them
// eslint-disable-next-line no-unused-vars
const preloadImages = () => {
  if (paper1Loaded !== null && !drawStarted) {
    clearInterval(preloadImagesTmr)
    init()
  }

  //  If, for some reason things haven't fired after 3.333 seconds, then just draw the stuff anyway
  //  without the textures
  if (new Date().getTime() - startTime > 3333 && !drawStarted) {
    clearInterval(preloadImagesTmr)
    init()
  }
}
