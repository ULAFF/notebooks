
      function make_statement_frags(stmt){
        return '<div><pre>'+stmt+'</pre></div>';
      }

      function display_code(stmts){
        var output = '';
        for (var i = 0; i != stmts.length; ++i){
          output += make_statement_frags(stmts[i]);
        }
        document.getElementById('display_code').innerHTML = output;
      }

      function highlight_code(stmtNum){
        document.getElementById('display_code').childNodes[stmtNum].className
        = 'curStat';
      }

      function unhighlight_code(stmtNum){
        document.getElementById('display_code').childNodes[stmtNum].className = '';
      }

