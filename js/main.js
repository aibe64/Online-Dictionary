// ERROR FUNCTION
let errMsg = (text) => {
  let errorMsg = document.querySelector('#error')
  errorMsg.className = 'alert alert-danger mb-4'
  errorMsg.style.display = 'block'
  errorMsg.textContent = text

  setTimeout(() => {
    errorMsg.style.display = 'none'
  }, 4000)
}

document.getElementById('year').innerText = new Date().getFullYear()

let wordId = document.querySelector('.wordId')
let wordDetail = document.querySelector('.wordDetail')
let wordEntry = document.querySelector('.wordEntry')
let defHeading = document.querySelector('.defHeading')

wordId.addEventListener('search', () => {
  const input = wordId.value.toLowerCase()
  // INPUT AUTHENTICATIONS
  for (let i = 0; i < input.split('').length; i++) (input[i] === ' ') ? errMsg(`Empty character found in ${input}`) : ''

  if (input === '') {
    errMsg('Please input a word')
    return false
  } else {
    const url = `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/${input}`
    const params = {
      'method': 'GET',
      'headers': {
        'x-rapidapi-host': 'lingua-robot.p.rapidapi.com',
        'x-rapidapi-key': 'ACCESS_KEY'
      }
    }
    axios(url, params)
      .then(r => {
        const wordParams = r.data.entries
        console.log(wordParams)
        if (wordParams.length === 0){
          setTimeout(() => {
            errMsg(`${input.toUpperCase()} is not a word`)
            return false
          }, 1500)
        } else {
          wordEntry.innerText = input
          defHeading.innerHTML = `<u>definitions</u>`
          let definition = 'synonymn(s): '

          for (const wordParam of wordParams) {
            let pronunciation = wordParam.pronunciations
            let lexeme = wordParam.lexemes
            // console.log(lexeme)
            
            let audioURL = 'audio URL(s)'
            let regionTranscription = ''
            
            for (const pronParams of pronunciation) {
              // console.log(pronunciation)
              // console.log(pronParams)
              if (pronParams.audio) {
                // console.log(pronParams.audio)

                // AUDIO URL
                audioURL += (`<h6>${pronParams.context.regions.map(reg =>reg)}: [<a href="${pronParams.audio.url}"  target="_blank">${pronParams.audio.url}</a>]<h6>`)
              }
              if (pronParams.context) {
                // console.log(pronParams.context)
                pronParams.context.regions.map(reg => {
                  // REGIONS
                  regionTranscription += `<b>${reg}: </b>`
                })
              }
              if (pronParams.transcriptions) {
                // console.log(pronParams.transcriptions)
                pronParams.transcriptions.map(tr=>{
                  // TRANSCRIPTION
                  regionTranscription += `${tr.transcription} `
                })
              }
              // console.log(pronParams)
            }
            for (const lex of lexeme) {
              // console.log(lexeme)
              // console.log(lex)
              if (lex.lemma !== undefined && lex.lemma !== input) {
                // LEMMA, as in Synonymns
                definition += `[${lex.lemma}]`
              }
              if (lex.partOfSpeech !== undefined) {
                // PART OF SPEECH
                definition += `<h5 class="mt-1 text-danger">${lex.partOfSpeech}</h5>`
              }
              if (lex.senses !== undefined) {
                lex.senses.map(senseParams => {
                  // DEFINITION
                  definition += `
                    <li>${senseParams.definition}</li>
                  `
                  // LABELS
                  if (senseParams.labels !== undefined) definition += `<div>[${senseParams.labels}]</div>`
                  // USAGE EXAMPLES
                  if (senseParams.usageExamples !== undefined) definition += `<div class="text-danger"><i>${senseParams.usageExamples}</i></div><br>`
                  })
              }
               
                
            }
            
            // console.log(audioURL)
            // console.log(regionTranscription)
            // console.log(posDefin)
            
            // console.log(partOS)
            
            document.querySelector('.transcription').innerHTML = `<div>${regionTranscription}</div>`

            document.querySelector('.audio').innerHTML = `${audioURL}`


          }
          document.querySelector('.defBody').innerHTML = definition
        }
        
        
      })
      .catch(() => errMsg('No network connection. Try again'))
  }
})