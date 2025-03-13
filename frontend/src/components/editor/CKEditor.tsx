import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo,
  GeneralHtmlSupport,
} from "ckeditor5";
import "./editorStyle.css";
import "ckeditor5/ckeditor5.css";

interface Props {
  onChange: (value: string) => void;
  data?: string;
}
export default function CustomCKEditor({ onChange, data }: Props) {
  return (
    <CKEditor
      data={data}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      editor={ClassicEditor}
      config={{
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "link",
          "insertTable",
          "mediaEmbed",
          "|",
          "bulletedList",
          "numberedList",
          "indent",
          "outdent",
        ],
        plugins: [
          Bold,
          Essentials,
          Heading,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          MediaEmbed,
          Paragraph,
          Table,
          Undo,
          GeneralHtmlSupport,
        ],
        htmlSupport: {
          allow: [
            {
              name: /.*/,
              attributes: true,
              classes: true,
              styles: true,
            },
          ],
        },
        initialData: data,
        licenseKey:
          "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDI2MDE1OTksImp0aSI6IjFjNzdjMzMxLTBmMTgtNDZmNy04ZGQ1LTQ1NTMyYTA2OWQwMSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImExZDM3YmI1In0.ovQnf6gCRB2JZr2wkXrYAVn_jYmDqcn6nwpGG6JtockyJQ2WDa6H-Cp73ond317sMAvjcj3cb2eQV5weBcLCNg",
      }}
    />
  );
}
