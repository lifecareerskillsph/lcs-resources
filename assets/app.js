/* ============================================================
   Life and Career Skills: ICLEX weekly module behavior script
   Shared across all lesson pages. Each function checks for its
   own markers before running, so a page missing a given feature
   (e.g. no checklist) simply skips that piece with no error.
   © F.C. Diaz. Built for lifecareerskillsph.
   ============================================================ */

(function(){

  /* ---------- Progress rail: highlight dots on scroll ---------- */
  function initRail(){
    var sections = Array.from(document.querySelectorAll('.wrap > section.block'));
    var dots = Array.from(document.querySelectorAll('.rail-dot'));
    if(!sections.length || !dots.length) return;

    function updateRail(){
      var scrollPos = window.scrollY + 140;
      var activeIndex = 0;
      sections.forEach(function(sec, i){
        if(sec.offsetTop <= scrollPos) activeIndex = i;
      });
      dots.forEach(function(d, i){
        d.classList.toggle('active', i <= activeIndex);
      });
    }
    window.addEventListener('scroll', updateRail);
    updateRail();
  }

  /* ---------- Rating tally: e.g. "Not started / In progress / Mostly there" ----------
     Any <p class="tally" id="..."> that sits inside the same .block as one or more
     <select data-rating> elements gets live-updated as those selects change.
     Works for any set of option values, not just Havighurst's three; it counts
     whatever distinct values actually appear among the option labels used. */
  function initRatingTallies(){
    var tallyEls = Array.from(document.querySelectorAll('.block .tally[id]'));
    tallyEls.forEach(function(tallyEl){
      var block = tallyEl.closest('.block');
      var selects = Array.from(block.querySelectorAll('select[data-rating]'));
      if(!selects.length) return;

      // Build the label map from the first select's own options, skipping the blank prompt.
      var labelMap = {};
      var order = [];
      Array.from(selects[0].options).forEach(function(opt){
        if(opt.value === '') return;
        labelMap[opt.value] = opt.textContent.trim();
        order.push(opt.value);
      });

      function render(){
        var counts = {};
        order.forEach(function(v){ counts[v] = 0; });
        selects.forEach(function(sel){
          if(sel.value && counts.hasOwnProperty(sel.value)) counts[sel.value]++;
        });
        var parts = order.map(function(v){ return labelMap[v] + ': ' + counts[v]; });
        tallyEl.textContent = parts.join(' / ');
      }

      selects.forEach(function(sel){ sel.addEventListener('change', render); });
      render();
    });
  }

  /* ---------- Fill-in matrix counter: "X of N levels completed" ----------
     A row counts as completed once BOTH its text inputs (protective and risk)
     have a non-empty value. Looks for <p class="tally" data-fill-counter>
     immediately following a <table class="matrix fill">. */
  function initFillCounters(){
    var counters = Array.from(document.querySelectorAll('[data-fill-counter]'));
    counters.forEach(function(counterEl){
      var table = counterEl.previousElementSibling;
      while(table && !table.matches('table.matrix.fill')) table = table.previousElementSibling;
      if(!table) return;

      var rows = Array.from(table.querySelectorAll('tbody tr'));

      function render(){
        var completed = 0;
        rows.forEach(function(row){
          var inputs = row.querySelectorAll('input[type="text"]');
          if(inputs.length && Array.from(inputs).every(function(i){ return i.value.trim() !== ''; })){
            completed++;
          }
        });
        counterEl.textContent = completed + ' of ' + rows.length + ' levels completed';
      }

      table.querySelectorAll('input[type="text"]').forEach(function(input){
        input.addEventListener('input', render);
      });
      render();
    });
  }

  /* ---------- Checklist counter: "X of N checked" ---------- */
  function initChecklistCounters(){
    var tallyEls = Array.from(document.querySelectorAll('.tally[id]'));
    tallyEls.forEach(function(tallyEl){
      var section = tallyEl.closest('.block');
      if(!section) return;
      var boxes = Array.from(section.querySelectorAll('input[type="checkbox"][data-checklist]'));
      if(!boxes.length) return;

      function render(){
        var checked = boxes.filter(function(b){ return b.checked; }).length;
        tallyEl.textContent = checked + ' of ' + boxes.length + ' checked';
      }
      boxes.forEach(function(b){ b.addEventListener('change', render); });
      render();
    });
  }

  /* ---------- Emotional intelligence slider average ---------- */
  function initEiAverage(){
    var avgEl = document.getElementById('ei-average');
    if(!avgEl) return;
    var sliders = Array.from(document.querySelectorAll('input[type="range"][data-ei]'));
    if(!sliders.length) return;

    function render(){
      var sum = sliders.reduce(function(acc, s){ return acc + Number(s.value); }, 0);
      var avg = (sum / sliders.length).toFixed(1);
      avgEl.textContent = 'Your average: ' + avg + ' out of 5';
    }
    sliders.forEach(function(s){ s.addEventListener('input', render); });
    render();
  }

  document.addEventListener('DOMContentLoaded', function(){
    initRail();
    initRatingTallies();
    initFillCounters();
    initChecklistCounters();
    initEiAverage();
  });

})();
