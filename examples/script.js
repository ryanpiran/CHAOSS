// Create web audio context
var audioCtx = new AudioContext();

// Create a buffer loader object
var bufferLoader = new BufferLoader(audioCtx);

// Buffer to hold drum kit samples
// (kick has key"kick", snare has key "snare" and hat has key "hat")
var sampleBuffers = {};

// URL of each sample to load
var sampleURLs = {"kick": "https://drjferraris.github.io/mcad.library/examples/samples/kick.wav", "snare": "https://drjferraris.github.io/mcad.library/examples/samples/snare.wav", "hat": "https://drjferraris.github.io/mcad.library/examples/samples/hat.wav"};

// Flag to determine whether or not the samples have finished loadin
var samplesLoaded = false;

// Load a kick, hat and snare sample into the list and associate them with the 
// "kick", "hat" and "snare" keys
bufferLoader.loadBufferList(sampleBuffers, sampleURLs, function() {
    
  console.log("Finished loading sampleBuffers!");
  samplesLoaded = true;
});

// Create a pattern scheduler instance
var scheduler = new Scheduler(audioCtx, {onAnim: animateStep,onQueue: queueStep, tempo: 120, maxSwing: 0.3, stepsPerBeat: 4, beatsPerPattern: 4}); 

// Duration (in seconds) each step plays back for
var noteDuration = 0.025; 

// Key/value list to hold pattern steps for each track
var steps = {};

// Each element in the key/value list is an array of steps
steps["kick"] = [];
steps["snare"] = [];
steps["crash"] = [];
steps["Hitom"] = [];
steps["Mediumtom"] = [];
steps["Lowtom"] = [];
steps["Openhihat"] = [];
steps["Closedhihat"] = [];

// Initialise all step values to off state (false)
for(var i = 0; i < scheduler.getStepsPerPattern(); i++) {
  console.log("steps per pattern" + scheduler.getStepsPerPattern());
  steps["kick"][i] = false;
  steps["snare"][i] = false;
  steps["crash"][i] = false;
  steps["Hitom"][i] = false;
  steps["Mediumtom"][i] = false;
  steps["Lowtom"][i] = false;
  steps["Openhihat"][i] = false;
  steps["Closedhihat"][i] = false;

}

//---------------------------------------------------------------------

// onQueue event handler
function queueStep(timeStamp, stepStamp) {

  // Iterate over each key/value pair in lists (each one is an array)
  // track will be the key value ("kick", "snare" or "hat")
  for(var track in steps) {
    
    console.log("track =    " + track);
    console.log("steps[track] =    " + steps[track]);
    console.log("stepStamp.patternPos =   " + stepStamp.patternPos);
    
    // Is the element in the step array for this track on?
    if(steps[track][stepStamp.patternPos]) {
    
      console.log("track =" + track);
      console.log("stepStamp.patternPos =" + stepStamp.patternPos);
      // Get an AudioBufferSourceNode.
      // This is the AudioNode to use when we want to play an AudioBuffer
      var source = audioCtx.createBufferSource();
      
      // Set the buffer tp the sample with the key value of the track variable
      source.buffer = sampleBuffers[track];
      
      // Connect the AudioBufferSourceNode to the destination output
      source.connect(audioCtx.destination);
      
      // Queue the sample for playback
      source.start(timeStamp.swing);
    }
  }
}

  // onAnim event handler
  function animateStep(currentStepStamp, lastStepStamp) {
    
  
    // Turn on led for current step
    //$("[data-step=" + currentStepStamp.patternPos + "]").find(".led").addClass("ledAnim");
    
    // Turn off led for last step
    //$("[data-step=" + lastStepStamp.patternPos + "]").find(".led").removeClass("ledAnim");
    
    //$('#stepLayout tr').eq(currentStepStamp.patternPos)
    
    $('#stepLayout tr').eq(0).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(0).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
    
    $('#stepLayout tr').eq(1).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(1).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
    
    $('#stepLayout tr').eq(2).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(2).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
    
    $('#stepLayout tr').eq(3).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(3).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
    
    $('#stepLayout tr').eq(4).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(4).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
    
    $('#stepLayout tr').eq(5).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(5).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
    
    $('#stepLayout tr').eq(6).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(6).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
    
    $('#stepLayout tr').eq(7).find('td').eq(currentStepStamp.patternPos).addClass("ledAnim");
    
    $('#stepLayout tr').eq(7).find('td').eq(lastStepStamp.patternPos).removeClass("ledAnim");
  }

//------------------------------------------------------------------------------

// When all of the elements have been loaded...
$(document).ready(function() {
  
  //Init controls
  $("#tempo").val(scheduler.tempo);
  $("#swing").val(mcad.unsignedNormToParam(scheduler.swing, 0, 100));
  
  
  $("#tempo").change(function(){
    scheduler.tempo = $(this).val();
  });
  
  $("#swing").change(function(){
    scheduler.swing = mcad.paramToUnsignedNorm($(this).val(), 0, 100);
  });
  
  $("#play").click(function() {
    
    if(scheduler.isPlaying) scheduler.stop();
    else scheduler.start(); scheduler.resumePlayback = true;
    
    $("#play").addClass("transportButtonDisabled");
    $("#pause").removeClass("transportButtonDisabled");
    $("#stop").removeClass("transportButtonDisabled");
  });
  
    // Pause transport button
  $("#pause").click(function(event) {

    if(scheduler.isPlaying === true) {

      scheduler.stop();
      
      $("#play").removeClass("transportButtonDisabled");
      $("#pause").addClass("transportButtonDisabled");
      $("#stop").removeClass("transportButtonDisabled");
    }

  });

  // Stop transport button
  $("#stop").click(function(event) {

    scheduler.stop();
    scheduler.resumePlayback = false;

    $("#play").removeClass("transportButtonDisabled");
    $("#pause").addClass("transportButtonDisabled");
    $("#stop").addClass("transportButtonDisabled");
    
    $("#stepLayout td").removeClass("ledAnim");
  });
  
    // clear transport button
  $("#clear").click(function(event) {

    $("#stepLayout td").removeClass("ledOn");
    
    for(var i = 0; i < scheduler.getStepsPerPattern(); i++) {
    console.log("steps per pattern" + scheduler.getStepsPerPattern());
      steps["kick"][i] = false;
      steps["snare"][i] = false;
      steps["crash"][i] = false;
      steps["Hitom"][i] = false;
      steps["Mediumtom"][i] = false;
      steps["Lowtom"][i] = false;
      steps["Openhihat"][i] = false;
      steps["Closedhihat"][i] = false;
    }

  });
  
  
  
  $("#stepLayout td").click(function() {
    
    var row = this.parentNode.rowIndex;
    var col = this.cellIndex;
    
    // $('#stepLayout tr').eq(row).attr("id") == track name
    
    var track = $('#stepLayout tr').eq(row).attr("id");
    
    console.log("track" + track);
    
    var idx = col;
    
    console.log("idx" + idx);
    
    // Toggle the value of this step in the steps array 
    steps[track][idx] = !steps[track][idx];
    
    console.log("steps[track][idx]" + steps[track][idx]);
    
    // Toggle the ledOn class on/off
    $('#stepLayout tr').eq(row).find('td').eq(col).toggleClass("ledOn");
    

    
    //alert($('#stepLayout tr').eq(row).attr("id") + col);
  });
  
});


