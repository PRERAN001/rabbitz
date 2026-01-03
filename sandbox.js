require.config({
  paths: {
    vs: "https://unpkg.com/monaco-editor@0.45.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  const editor = monaco.editor.create(document.getElementById("editor"), {
    value: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: black;
      color: white;
      text-align: center;
      font-family: Arial;
    }
  </style>
</head>
<body>
  <h1>rabbitz </h1>
  <p>Welcome to rabbitz! </p>
  <p>build continues after sem exams sad :(</p>

  <script>
    console.log("Sandbox running");
  <\/script>
</body>
</html>`,
    language: "html",
    theme: "vs-dark",
    automaticLayout: true,
  });

  const iframe = document.getElementById("preview");

  function updatePreview() {
    iframe.srcdoc = editor.getValue();
  }

  editor.onDidChangeModelContent(updatePreview);
  updatePreview();
});
