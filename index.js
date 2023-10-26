/* global fxrand fxhash originalFeatures Path2D $fx fxpreview paper1Loaded preloadImagesTmr labelData */

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
let dpr = null

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
      x: $fx.rand(),
      y: $fx.rand()
    },
    paper2: {
      x: $fx.rand(),
      y: $fx.rand()
    }
  }

  // deconstruct the entry in the originalFeatures array into the existing features object
  const { label, coloured, bpm } = originalFeatures[$fx.iteration - 1]
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
      size: $fx.rand() * 0.05 + 0.05,
      start: $fx.rand() * Math.PI * 2,
      roation: $fx.rand() * Math.PI * 2,
      xOffset: $fx.rand() - 0.5,
      yOffset: $fx.rand() - 0.5
    })
  }

  features.tabsRotation = Math.floor($fx.rand() * 4)

  // Do the curve
  //  The starting and ending postion can be in any of five points
  //  Top, Bottom, Middle and the two quarter points
  const curve = {}
  curve.start = Math.floor($fx.rand() * 5) * 0.25
  curve.end = curve.start
  //  The end can't match the start
  while (curve.start === curve.end) curve.end = Math.floor($fx.rand() * 5) * 0.25
  //  20% of the time we'll make the land have a flat half, so we can put trees and buildings on them
  if ($fx.rand() < 0.2) {
    curve.mode = 'half'
    curve.middle = curve.start // left side flat
    if ($fx.rand() < 0.5) curve.middle = curve.end // 50% of the time right side flat
  }
  features.curve = curve

  features.hexagon = {
    x: $fx.rand() * 0.8 + 0.1,
    y: ($fx.rand() * 0.5 + 0.25) / 2
  }

  // We may have some chevrons
  if ($fx.rand() < 0.2) {
    features.chevrons = {
      number: Math.floor($fx.rand() * 6) + 4,
      flipped: $fx.rand() < 0.5
    }
  } else {
    // There is a 20% chance of straight lines
    if ($fx.rand() < 0.2) {
      features.straights = {
        number: Math.floor($fx.rand() * 6) + 4
      }
    }
  }

  // Now we need 50000 random numbers we can use for the pressing number
  features.randomPressingNumbers = []
  for (let i = 0; i < 50000; i++) features.randomPressingNumbers.push($fx.rand())
}

// Call makeFeatures() right away, because we want to do this as soon as possible
makeFeatures()
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

  // Draw the curve
  // We are going to draw a curve from the start to end point, in the bottom 1/3 of the screen, let's start in the bottom left corner
  ctx.beginPath()
  ctx.moveTo(0, h)
  // move up the start point
  ctx.lineTo(0, h - (h / 3 * features.curve.start))
  // move to the end point
  ctx.lineTo(w, h - (h / 3 * features.curve.end))
  // move to the bottom right corner
  ctx.lineTo(w, h)
  // close the path
  ctx.closePath()
  // fill it in with the primary colour
  ctx.fillStyle = features.primaryColours.medium
  ctx.fill()

  // Now draw a circle based on the x,y co-ordinates in the features.hexagon object
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = 0.2
  ctx.save()
  ctx.translate(w * features.hexagon.x, h * features.hexagon.y)
  const radius = w * 0.15
  const points = []
  // Create six points of the hexagon, by rotating a point 0,-radius around the origin (which is 0,0 to make the calculations easier)
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    points.push({ x, y })
  }
  // Now draw the hexagon, scaling it down each time
  const newPoints = JSON.parse(JSON.stringify(points))
  ctx.save()
  // Scale the hexagon down
  ctx.scale(0.8, 0.8)
  ctx.beginPath()
  ctx.moveTo(newPoints[0].x, newPoints[0].y)
  for (let i = 1; i < 6; i++) {
    ctx.lineTo(newPoints[i].x, newPoints[i].y)
  }
  ctx.closePath()
  ctx.fillStyle = features.secondaryColours.medium
  ctx.fill()
  ctx.restore()

  ctx.restore()

  // now add the label colours
  // Make a gradient from top to bottom, that runs through the colours
  ctx.globalCompositeOperation = 'multiply'
  ctx.globalAlpha = 0.75
  const grd = ctx.createLinearGradient(0, 0, 0, h)
  grd.addColorStop(0, features.secondaryColours.shade)
  grd.addColorStop(0.33, features.secondaryColours.dark)
  grd.addColorStop(0.66, features.secondaryColours.medium)
  grd.addColorStop(1.00, features.secondaryColours.light)
  ctx.fillStyle = grd
  ctx.fillRect(w * 0.1, 0, w * 0.15, h)

  ctx.save()
  // Move the origin to the middle
  ctx.translate(w / 2, h / 2)
  // Rotate 90 degrees
  ctx.rotate(Math.PI / 2 * features.tabsRotation)

  // Now I want two little squares on the right edge, taking into account the
  // origin being in the middle
  ctx.fillStyle = features.primaryColours.medium
  ctx.fillRect(w * 0.45, -h * 0.3, w * 0.05, h * 0.1)
  // now do the secondary colour
  ctx.fillStyle = features.secondaryColours.medium
  ctx.fillRect(w * 0.45, -h * 0.25, w * 0.05, h * 0.05)

  ctx.restore()

  // Write the words
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = 0.9
  ctx.fillStyle = '#D8C49E'
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
  ctx.lineWidth = w / 2000
  // Draw a circle, right in the middle
  // Loop round the scuffs
  features.scuffs.forEach(scuff => {
    //
    ctx.beginPath()
    ctx.arc(w / 2 + (scuff.xOffset * w / 50), h / 2 + (scuff.yOffset * h / 50), w * 0.47, scuff.start, scuff.start * scuff.size)
    ctx.stroke()
  })

  ctx.globalCompositeOperation = 'source-over'

  // If we have chevrons, then draw them
  if (features.chevrons) {
    ctx.save()
    // If the chevrons are flipped, then flip the canvas
    if (features.chevrons.flipped) {
      ctx.scale(1, -1)
      // And move the canvas down
      ctx.translate(0, -h)
    }

    // The start at 1/4 of the way down, and go to 1/2 of the way down
    const start = h / 4
    const end = h / 2
    // So we need to know the spacing between them
    const spacing = (end - start) / (features.chevrons.number - 1)
    // The colour is a dark brown (#5B5534) but we want it as an RGB value
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.66)'
    ctx.lineWidth = h / 200
    // The line ends need to be square
    ctx.lineCap = 'square'
    // Loop through the number of them and draw the lines
    for (let i = 0; i < features.chevrons.number; i++) {
      ctx.beginPath()
      ctx.moveTo(0, start + (spacing * i))
      ctx.lineTo(w / 2, start + (spacing * i) + h / 3)
      ctx.lineTo(w, start + (spacing * i))
      ctx.stroke()
    }
    ctx.restore()
  }

  // If we have straights, then draw them
  if (features.straights) {
    const start = h / 8 * 3
    const end = h / 8 * 5
    // So we need to know the spacing between them
    const spacing = (end - start) / (features.straights.number - 1)
    // The colour is a dark brown (#5B5534) but we want it as an RGB value
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.66)'
    ctx.lineWidth = h / 200
    // The line ends need to be square
    ctx.lineCap = 'square'
    // Loop through the number of them and draw the lines
    for (let i = 0; i < features.straights.number; i++) {
      ctx.beginPath()
      ctx.moveTo(0, start + (spacing * i))
      ctx.lineTo(w, start + (spacing * i))
      ctx.stroke()
    }
  }

  // Remove the clip mask
  ctx.restore()

  // Now I want a new clip mask that's a circle in the middle
  ctx.save()
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w * 0.195, 0, Math.PI * 2)
  ctx.clip()
  // Now fill with the paper texture
  ctx.fillStyle = features.paper1Pattern
  ctx.fillRect(0, 0, w, h)
  // Grab the labelData
  const thisLabel = labelData[$fx.iteration - 1]
  // If we have coloured vinyl, then we need to do that
  if (thisLabel.vinylColour) {
    ctx.fillStyle = thisLabel.vinylColour
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.3
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }
  // Now restore the clip mask
  ctx.restore()

  // Now we draw the label, let's set the labelRadius
  const labelRadius = w * 0.195 * 0.95
  // Save the context
  ctx.save()
  // Move the origin to the middle
  ctx.translate(w / 2, h / 2)
  ctx.rotate(thisLabel.labelAngle * Math.PI / 180)

  // Draw the first colour label
  ctx.globalCompositeOperation = 'multiply'
  const label1 = new Path2D()
  label1.arc(0, 0, labelRadius, 0, 2 * Math.PI)
  // Clip mask and fill
  ctx.save()
  ctx.clip(label1)
  ctx.rect(-w, -h, w * 2, h * 2)
  ctx.fillStyle = `hsla(${thisLabel.label1Colour.h}, ${thisLabel.label1Colour.s}%, ${thisLabel.label1Colour.l}%, 1)`
  ctx.fill()
  ctx.restore()

  // Now do the second colour label
  ctx.save()
  const label2 = new Path2D()
  label2.arc((w / 400) * thisLabel.labelOffsetX, -(h / 200) * thisLabel.labelOffsetY, labelRadius, 0, 1 * Math.PI)
  ctx.clip(label2)
  ctx.fillStyle = `hsla(${thisLabel.label2Colour.h}, ${thisLabel.label2Colour.s}%, ${thisLabel.label2Colour.l}%, 1)`
  ctx.fill()
  ctx.restore()

  // Now we need to make a much smaller circle which is the hole in the middle
  ctx.globalCompositeOperation = 'source-over'
  ctx.beginPath()
  ctx.arc(0, 0, w * 0.013, 0, 2 * Math.PI)
  // And fill with the paper texture again
  ctx.fillStyle = features.paper1Pattern
  ctx.fill()
  // And a very thin black line around the edge
  ctx.strokeStyle = '#000'
  ctx.lineWidth = w / 1000
  ctx.stroke()

  // restore the move to the middle context
  ctx.restore()

  // Now I want to add a subtle drop shadow to the whole thing
  // Add a clipping mask which is the label hole
  ctx.save()
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, w * 0.195, 0, Math.PI * 2)
  ctx.clip()

  // Now I want to draw a circle a few times over in a loop offsetting
  // the x,y middle, and setting the fill to be only very slightly opaque
  // so it's a subtle shadow
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.lineWidth = w / 500
  // Loop through the number of them and draw the lines
  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    ctx.arc(w / 2 + (w / 2000 * i), h / 2 + (h / 2000 * i), w * 0.195, 0, Math.PI * 2)
    ctx.stroke()
  }
  // Restore the clipping mask
  ctx.restore()
  // Now make a very thing white line around the edge og the label circle
  const edgeSize = w * 0.1
  const edgeGrd = ctx.createLinearGradient(w / 2 - edgeSize, h / 2 - edgeSize, w / 2 + edgeSize, h / 2 + edgeSize)
  edgeGrd.addColorStop(0, 'rgba(0, 0, 0, 0.5)')
  edgeGrd.addColorStop(1, 'rgba(255, 255, 255, 0.5)')
  ctx.strokeStyle = edgeGrd
  ctx.lineWidth = w / 1000
  ctx.beginPath()
  ctx.arc(w / 1.996, h / 1.996, w * 0.195, 0, Math.PI * 2)
  ctx.stroke()

  // Now I want to create a canvas buffer to draw some text onto
  // I want it to be 1/6 the width of the cover, and 1/4 the height
  const buffer = document.createElement('canvas')
  buffer.width = w / 3.8
  buffer.height = h / 3
  const bufferCtx = buffer.getContext('2d')

  // Now in black I want to write the word "PRESSING" in the condensed font
  // so it fits the width of the buffer
  bufferCtx.fillStyle = '#5B5534'
  bufferCtx.textAlign = 'center'
  bufferCtx.font = `${buffer.width * 0.24}px FCBold`
  bufferCtx.fillText('PRESSING', buffer.width / 2, buffer.height * 0.16)
  // Now I want the iteration number padded with a leading zero if needed
  const iterationText = `#${$fx.iteration.toString().padStart(2, '0')}`
  // Now in black I want to write the iteration number in the condensed font
  // so it fits the width of the buffer
  // We need to calculate the font size, by taking the width of the buffer
  // and having a loop that tests the text width, and if it's too wide
  // when we get there we break out of the loop and use the previous font size
  let fontSize = buffer.width * 0.24
  for (let i = 0; i < 2000; i++) {
    bufferCtx.font = `${fontSize}px FBold`
    if (bufferCtx.measureText(iterationText).width > buffer.width) {
      fontSize--
      break
    }
    fontSize++
  }
  bufferCtx.font = `${fontSize}px FBold`
  bufferCtx.fillText(iterationText, buffer.width / 2, buffer.height * 0.47)
  // Now I want "phonohash" in the condensed font
  bufferCtx.font = `${buffer.width * 0.2}px FCBold`
  bufferCtx.fillText('phonohash', buffer.width / 2, buffer.height * 0.61)
  // Now I want to do lots of white 0.5 alpha circles dotted all over it
  // to give it a distressed look
  bufferCtx.globalAlpha = 0.3
  bufferCtx.fillStyle = '#fff'
  for (let i = 0; i < 5000; i++) {
    bufferCtx.beginPath()
    bufferCtx.arc(features.randomPressingNumbers[i] * buffer.width, features.randomPressingNumbers[i + 1] * buffer.height, buffer.width * (0.01 * (features.randomPressingNumbers[i + 2] + 0.0001)), 0, Math.PI * 2)
    bufferCtx.fill()
  }

  // Copy the buffer over
  // Set the compostion to be multiply, and the global alpha to be 0.8
  ctx.globalCompositeOperation = 'darken'
  ctx.globalAlpha = 1
  ctx.drawImage(buffer, w - (w / 18) - buffer.width, h / 40, buffer.width * 0.8, buffer.height * 0.8)
  // Now set the compostion to be source-over, and the global alpha to be 1
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = 1

  // Now remove the buffer and buffer element
  buffer.remove()

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
  dpr = devicePixelRatio
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
