/**
 * Melqart website feedback widget (mock).
 *
 * Embed on any page:
 *
 *   <script>
 *     window.MelqartFeedback = {
 *       position: "bottom-right", // bottom-right | bottom-left | top-right | top-left
 *       offsetX: 24,
 *       offsetY: 24,
 *       locale: "en",             // en | ar
 *       button: {
 *         label: { en: "Feedback", ar: "ملاحظات" },
 *         background: "#0A3D78",
 *         color: "#ffffff"
 *       }
 *     };
 *   </script>
 *   <script src="widget.js"></script>
 *
 * Question type codes match Melqart: MC, TE, FF, SL, NPS, MTX, FU.
 * Answers stay in the browser. Nothing is sent to a server.
 */
(function () {
  if (window.__MELQART_FEEDBACK_WIDGET__) return;
  window.__MELQART_FEEDBACK_WIDGET__ = true;

  var script = document.currentScript;
  var POSITIONS = ["bottom-right", "bottom-left", "top-right", "top-left"];

  var UI = {
    next: { en: "Next", ar: "التالي" },
    previous: { en: "Previous", ar: "السابق" },
    submit: { en: "Submit", ar: "إرسال" },
    close: { en: "Close", ar: "إغلاق" },
    required: { en: "This field is required", ar: "هذا الحقل مطلوب" },
    email: { en: "Enter a valid email", ar: "أدخل بريداً إلكترونياً صحيحاً" },
    fileSize: { en: "File is larger than 5 MB", ar: "حجم الملف أكبر من 5 ميغابايت" },
    fileType: { en: "This file type is not allowed", ar: "نوع الملف غير مسموح" },
    page: { en: "Page", ar: "صفحة" },
    of: { en: "of", ar: "من" },
    thanksTitle: { en: "Thank you", ar: "شكراً لك" },
    thanksBody: {
      en: "Your response was recorded. This is a preview, so nothing was sent to a server.",
      ar: "تم حفظ إجابتك. هذا عرض تجريبي ولم يُرسل شيء إلى الخادم.",
    },
    again: { en: "Send another response", ar: "إرسال رد آخر" },
    summary: { en: "Your answers", ar: "إجاباتك" },
    chooseFile: { en: "Choose a file", ar: "اختر ملفاً" },
    noFile: { en: "No file selected", ar: "لم يتم اختيار ملف" },
    remove: { en: "Remove", ar: "إزالة" },
    language: { en: "Language", ar: "اللغة" },
    notLikely: { en: "Not likely", ar: "غير محتمل" },
    veryLikely: { en: "Very likely", ar: "محتمل جداً" },
  };

  /**
   * Shape follows a Melqart survey: pages of questions, type codes from
   * QuestionTypes, and the same config keys the survey renderer reads
   * (answerType, textType, sliderType, matrixType, minimum, maximum).
   * NPS options 0–10 are created at render time, as in the survey builder.
   */
  var MOCK_SURVEY = {
    id: "mock-branch-feedback",
    title: { en: "Branch visit feedback", ar: "تقييم زيارة الفرع" },
    description: {
      en: "Tell us about your last visit. It takes about a minute.",
      ar: "أخبرنا عن زيارتك الأخيرة. يستغرق ذلك حوالي دقيقة.",
    },
    pages: [
      {
        id: "p1",
        title: { en: "Your visit", ar: "زيارتك" },
        questions: [
          {
            id: "q1",
            userDefinedId: "Q1",
            questionType: "MC",
            required: true,
            text: { en: "How did you visit us today?", ar: "كيف تمت زيارتك اليوم؟" },
            config: { answerType: "Allow one answer", format: "List", alignment: "Vertical" },
            options: [
              { id: "q1-branch", value: "branch", text: { en: "Branch", ar: "الفرع" } },
              { id: "q1-web", value: "website", text: { en: "Website", ar: "الموقع الإلكتروني" } },
              { id: "q1-app", value: "app", text: { en: "Mobile app", ar: "تطبيق الجوال" } },
              { id: "q1-phone", value: "phone", text: { en: "Phone call", ar: "مكالمة هاتفية" } },
            ],
          },
          {
            id: "q2",
            userDefinedId: "Q2",
            questionType: "MC",
            required: true,
            text: {
              en: "What did you do during this visit?",
              ar: "ماذا فعلت خلال هذه الزيارة؟",
            },
            config: { answerType: "Allow multiple answers", format: "List", alignment: "Vertical" },
            options: [
              { id: "q2-ask", value: "ask", text: { en: "Asked about a product", ar: "سألت عن منتج" } },
              { id: "q2-buy", value: "buy", text: { en: "Made a purchase", ar: "أتممت عملية شراء" } },
              { id: "q2-help", value: "help", text: { en: "Asked for support", ar: "طلبت المساعدة" } },
              { id: "q2-browse", value: "browse", text: { en: "Just browsing", ar: "تصفحت فقط" } },
            ],
          },
        ],
      },
      {
        id: "p2",
        title: { en: "Your rating", ar: "تقييمك" },
        questions: [
          {
            id: "q3",
            userDefinedId: "Q3",
            questionType: "NPS",
            required: true,
            text: {
              en: "How likely are you to recommend us to a friend?",
              ar: "ما مدى احتمال أن توصي بنا لصديق؟",
            },
            labels: [
              { text: { en: "Not likely", ar: "غير محتمل" } },
              { text: { en: "Very likely", ar: "محتمل جداً" } },
            ],
          },
          {
            id: "q4",
            userDefinedId: "Q4",
            questionType: "SL",
            required: true,
            text: {
              en: "How do you rate the speed of service?",
              ar: "كيف تقيّم سرعة الخدمة؟",
            },
            config: {
              sliderType: "Slider",
              minimum: 0,
              maximum: 10,
              incrementValue: 1,
              showValue: true,
            },
            labels: {
              min: { en: "Slow", ar: "بطيء" },
              max: { en: "Fast", ar: "سريع" },
            },
          },
          {
            id: "q5",
            userDefinedId: "Q5",
            questionType: "MTX",
            required: true,
            text: { en: "Please rate the following.", ar: "يرجى تقييم الآتي." },
            config: { matrixType: "Likert", answerType: "Allow one answer" },
            options: [
              { id: "q5-staff", text: { en: "Staff courtesy", ar: "تعامل الموظفين" } },
              { id: "q5-wait", text: { en: "Waiting time", ar: "وقت الانتظار" } },
              { id: "q5-clear", text: { en: "Clarity of information", ar: "وضوح المعلومات" } },
            ],
            secondaryLabels: [
              { id: "q5-1", value: "1", text: { en: "Poor", ar: "ضعيف" } },
              { id: "q5-2", value: "2", text: { en: "Fair", ar: "مقبول" } },
              { id: "q5-3", value: "3", text: { en: "Good", ar: "جيد" } },
              { id: "q5-4", value: "4", text: { en: "Excellent", ar: "ممتاز" } },
            ],
          },
        ],
      },
      {
        id: "p3",
        title: { en: "More details", ar: "تفاصيل إضافية" },
        questions: [
          {
            id: "q6",
            userDefinedId: "Q6",
            questionType: "TE",
            required: true,
            text: { en: "What should we improve first?", ar: "ما أول شيء يجب تحسينه؟" },
            config: { textType: "Single Line" },
          },
          {
            id: "q7",
            userDefinedId: "Q7",
            questionType: "TE",
            required: false,
            text: {
              en: "Is there anything else you want to tell us?",
              ar: "هل هناك شيء آخر تود إخبارنا به؟",
            },
            config: { textType: "Multiple Line" },
          },
          {
            id: "q8",
            userDefinedId: "Q8",
            questionType: "FF",
            required: true,
            text: { en: "Your contact details", ar: "بيانات التواصل" },
            options: [
              { id: "q8-name", dataType: "Text", text: { en: "Full name", ar: "الاسم الكامل" } },
              { id: "q8-email", dataType: "Email", text: { en: "Email", ar: "البريد الإلكتروني" } },
              { id: "q8-mobile", dataType: "Numeric", text: { en: "Mobile number", ar: "رقم الجوال" } },
            ],
          },
          {
            id: "q9",
            userDefinedId: "Q9",
            questionType: "FU",
            required: false,
            text: {
              en: "Attach a photo or a file (optional)",
              ar: "أرفق صورة أو ملفاً (اختياري)",
            },
            hint: {
              en: "PNG, JPG, or PDF. Maximum 5 MB.",
              ar: "PNG أو JPG أو PDF. الحد الأقصى 5 ميغابايت.",
            },
            config: { accept: ".png,.jpg,.jpeg,.pdf", maxSizeMb: 5 },
          },
        ],
      },
    ],
  };

  var incoming = window.MelqartFeedback && typeof window.MelqartFeedback === "object"
    ? window.MelqartFeedback
    : {};

  var options = {
    position: "bottom-right",
    offsetX: 24,
    offsetY: 24,
    locale: "en",
    zIndex: 2147483000,
    survey: MOCK_SURVEY,
    button: {
      label: { en: "Feedback", ar: "ملاحظات" },
      background: "#0A3D78",
      color: "#ffffff",
      radius: 999,
    },
  };

  mergeOptions(options, incoming);
  mergeOptions(options, readDataset(script));

  var survey = options.survey || MOCK_SURVEY;
  var state = {
    open: false,
    locale: options.locale === "ar" ? "ar" : "en",
    page: 0,
    answers: {},
    errors: {},
    submitted: false,
    lastResponse: null,
  };

  var host;
  var shadow;
  var root;

  function mergeOptions(target, source) {
    if (!source) return;
    if (source.position && POSITIONS.indexOf(source.position) !== -1) target.position = source.position;
    if (source.offsetX !== undefined && source.offsetX !== "") target.offsetX = Number(source.offsetX) || 0;
    if (source.offsetY !== undefined && source.offsetY !== "") target.offsetY = Number(source.offsetY) || 0;
    if (source.locale === "ar" || source.locale === "en") target.locale = source.locale;
    if (source.zIndex) target.zIndex = Number(source.zIndex) || target.zIndex;
    if (source.survey) target.survey = source.survey;
    if (source.button) {
      target.button = target.button || {};
      if (source.button.label !== undefined) target.button.label = source.button.label;
      if (source.button.background) target.button.background = source.button.background;
      if (source.button.color) target.button.color = source.button.color;
      if (source.button.radius !== undefined) target.button.radius = source.button.radius;
    }
    if (typeof source.label === "string" && source.label) target.button.label = source.label;
    if (source.background) target.button.background = source.background;
    if (source.color) target.button.color = source.color;
  }

  function readDataset(node) {
    if (!node || !node.dataset) return {};
    var data = node.dataset;
    return {
      position: data.position,
      offsetX: data.offsetX,
      offsetY: data.offsetY,
      locale: data.locale,
      zIndex: data.zIndex,
      label: data.label,
      background: data.color,
      color: data.textColor,
    };
  }

  function text(value) {
    if (value && typeof value === "object") return value[state.locale] || value.en || "";
    return value == null ? "" : String(value);
  }

  function ui(key) {
    return text(UI[key]);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentPage() {
    return survey.pages[state.page];
  }

  function isMultiple(question) {
    return question.config && question.config.answerType === "Allow multiple answers";
  }

  function isEmpty(question) {
    var answer = state.answers[question.id];
    switch (question.questionType) {
      case "MC":
        return isMultiple(question) ? !answer || !answer.length : !answer;
      case "TE":
        return !String(answer || "").trim();
      case "FF":
        return (question.options || []).some(function (option) {
          return !String((answer && answer[option.id]) || "").trim();
        });
      case "SL":
      case "NPS":
        return answer === undefined || answer === null || answer === "";
      case "MTX":
        return (question.options || []).some(function (row) {
          return !answer || !answer[row.id];
        });
      case "FU":
        return !answer;
      default:
        return !answer;
    }
  }

  function questionError(question) {
    if (question.required && isEmpty(question)) return ui("required");
    if (question.questionType === "FF") {
      var values = state.answers[question.id] || {};
      var invalid = (question.options || []).some(function (option) {
        if (option.dataType !== "Email") return false;
        var value = String(values[option.id] || "").trim();
        if (!value) return false;
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      });
      if (invalid) return ui("email");
    }
    return "";
  }

  function validatePage(page) {
    var errors = {};
    (page.questions || []).forEach(function (question) {
      var message = questionError(question);
      if (message) errors[question.id] = message;
    });
    return errors;
  }

  function optionById(question, id) {
    var list = (question.options || []).concat(question.secondaryLabels || []);
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function displayAnswer(question) {
    var answer = state.answers[question.id];
    if (answer === undefined || answer === null || answer === "") return "—";
    if (question.questionType === "MC") {
      var ids = isMultiple(question) ? answer : [answer];
      if (!ids.length) return "—";
      return ids
        .map(function (id) {
          var option = optionById(question, id);
          return option ? text(option.text) : id;
        })
        .join(state.locale === "ar" ? "، " : ", ");
    }
    if (question.questionType === "MTX") {
      return (question.options || [])
        .map(function (row) {
          var scale = optionById(question, answer[row.id]);
          return text(row.text) + ": " + (scale ? text(scale.text) : "—");
        })
        .join(" · ");
    }
    if (question.questionType === "FF") {
      return (question.options || [])
        .map(function (option) {
          return text(option.text) + ": " + (answer[option.id] || "—");
        })
        .join(" · ");
    }
    if (question.questionType === "FU") return answer.name || "—";
    return String(answer);
  }

  function buildResponse() {
    var answers = [];
    survey.pages.forEach(function (page) {
      (page.questions || []).forEach(function (question) {
        answers.push({
          questionId: question.id,
          userDefinedId: question.userDefinedId,
          questionType: question.questionType,
          value: state.answers[question.id] === undefined ? null : state.answers[question.id],
          display: displayAnswer(question),
        });
      });
    });
    return {
      surveyId: survey.id,
      locale: state.locale,
      submittedAt: new Date().toISOString(),
      pageUrl: location.href,
      answers: answers,
    };
  }

  function renderChoice(question) {
    var multiple = isMultiple(question);
    var selected = state.answers[question.id];
    return (
      '<div class="mf-choices" role="' +
      (multiple ? "group" : "radiogroup") +
      '">' +
      (question.options || [])
        .map(function (option) {
          var checked = multiple
            ? selected && selected.indexOf(option.id) !== -1
            : selected === option.id;
          return (
            '<label class="mf-choice">' +
            '<input type="' +
            (multiple ? "checkbox" : "radio") +
            '" name="q-' +
            esc(question.id) +
            '" data-qid="' +
            esc(question.id) +
            '" data-kind="choice" value="' +
            esc(option.id) +
            '"' +
            (checked ? " checked" : "") +
            ">" +
            "<span>" +
            esc(text(option.text)) +
            "</span></label>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderText(question) {
    var value = state.answers[question.id] || "";
    var type = (question.config && question.config.textType) || "Single Line";
    if (type === "Multiple Line") {
      return (
        '<textarea class="mf-input" rows="4" data-qid="' +
        esc(question.id) +
        '" data-kind="text">' +
        esc(value) +
        "</textarea>"
      );
    }
    var inputType = type === "Numeric" ? "number" : type === "Date" ? "date" : "text";
    return (
      '<input class="mf-input" type="' +
      inputType +
      '" data-qid="' +
      esc(question.id) +
      '" data-kind="text" value="' +
      esc(value) +
      '">'
    );
  }

  function renderForm(question) {
    var values = state.answers[question.id] || {};
    return (
      '<div class="mf-fields">' +
      (question.options || [])
        .map(function (option) {
          var kind = option.dataType === "Numeric" ? "numeric" : "field";
          var type = option.dataType === "Email" ? "email" : "text";
          return (
            '<label class="mf-field"><span>' +
            esc(text(option.text)) +
            "</span>" +
            '<input class="mf-input" type="' +
            type +
            '" inputmode="' +
            (option.dataType === "Numeric" ? "numeric" : option.dataType === "Email" ? "email" : "text") +
            '" data-qid="' +
            esc(question.id) +
            '" data-kind="' +
            kind +
            '" data-field="' +
            esc(option.id) +
            '" value="' +
            esc(values[option.id] || "") +
            '"></label>'
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderSlider(question) {
    var min = Number(question.config && question.config.minimum) || 0;
    var max = Number(question.config && question.config.maximum);
    if (!max && max !== 0) max = 10;
    var step = Number(question.config && question.config.incrementValue) || 1;
    var value = state.answers[question.id];
    var shown = value === undefined || value === null || value === "" ? min : value;
    var label = value === undefined || value === null || value === "" ? "—" : String(value);
    var minLabel = question.labels && question.labels.min ? text(question.labels.min) : String(min);
    var maxLabel = question.labels && question.labels.max ? text(question.labels.max) : String(max);
    return (
      '<div class="mf-slider">' +
      '<input type="range" min="' +
      min +
      '" max="' +
      max +
      '" step="' +
      step +
      '" value="' +
      esc(shown) +
      '" data-qid="' +
      esc(question.id) +
      '" data-kind="slider"' +
      (value === undefined ? ' data-unset="true"' : "") +
      ">" +
      '<div class="mf-slider-meta"><span>' +
      esc(minLabel) +
      '</span><strong data-slider-value="' +
      esc(question.id) +
      '">' +
      esc(label) +
      "</strong><span>" +
      esc(maxLabel) +
      "</span></div></div>"
    );
  }

  function renderNps(question) {
    var selected = state.answers[question.id];
    var low = question.labels && question.labels[0] ? text(question.labels[0].text) : ui("notLikely");
    var high = question.labels && question.labels[1] ? text(question.labels[1].text) : ui("veryLikely");
    var buttons = "";
    for (var score = 0; score <= 10; score += 1) {
      buttons +=
        '<label class="mf-nps-btn">' +
        '<input type="radio" name="q-' +
        esc(question.id) +
        '" data-qid="' +
        esc(question.id) +
        '" data-kind="nps" value="' +
        score +
        '"' +
        (String(selected) === String(score) ? " checked" : "") +
        "><span>" +
        score +
        "</span></label>";
    }
    return (
      '<div class="mf-nps"><div class="mf-nps-scale" role="radiogroup">' +
      buttons +
      '</div><div class="mf-slider-meta"><span>' +
      esc(low) +
      "</span><span>" +
      esc(high) +
      "</span></div></div>"
    );
  }

  function renderMatrix(question) {
    var answers = state.answers[question.id] || {};
    var head =
      "<tr><th></th>" +
      (question.secondaryLabels || [])
        .map(function (column) {
          return "<th>" + esc(text(column.text)) + "</th>";
        })
        .join("") +
      "</tr>";
    var body = (question.options || [])
      .map(function (row) {
        return (
          "<tr><th>" +
          esc(text(row.text)) +
          "</th>" +
          (question.secondaryLabels || [])
            .map(function (column) {
              var checked = answers[row.id] === column.id;
              return (
                '<td><label class="mf-matrix-hit"><input type="radio" name="q-' +
                esc(question.id) +
                "-" +
                esc(row.id) +
                '" data-qid="' +
                esc(question.id) +
                '" data-kind="matrix" data-row="' +
                esc(row.id) +
                '" value="' +
                esc(column.id) +
                '" aria-label="' +
                esc(text(row.text)) +
                " — " +
                esc(text(column.text)) +
                '"' +
                (checked ? " checked" : "") +
                "><span></span></label></td>"
              );
            })
            .join("") +
          "</tr>"
        );
      })
      .join("");
    return '<div class="mf-matrix-wrap"><table class="mf-matrix"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div>";
  }

  function renderFile(question) {
    var file = state.answers[question.id];
    var accept = (question.config && question.config.accept) || ".png,.jpg,.jpeg,.pdf";
    return (
      '<div class="mf-file">' +
      (question.hint ? '<p class="mf-hint">' + esc(text(question.hint)) + "</p>" : "") +
      '<label class="mf-file-btn"><input type="file" accept="' +
      esc(accept) +
      '" data-qid="' +
      esc(question.id) +
      '" data-kind="file"><span>' +
      esc(ui("chooseFile")) +
      "</span></label>" +
      '<span class="mf-file-name">' +
      esc(file ? file.name : ui("noFile")) +
      "</span>" +
      (file
        ? '<button type="button" class="mf-text-btn" data-action="clear-file" data-qid="' +
          esc(question.id) +
          '">' +
          esc(ui("remove")) +
          "</button>"
        : "") +
      "</div>"
    );
  }

  function renderControl(question) {
    switch (question.questionType) {
      case "MC":
        return renderChoice(question);
      case "TE":
        return renderText(question);
      case "FF":
        return renderForm(question);
      case "SL":
        return renderSlider(question);
      case "NPS":
        return renderNps(question);
      case "MTX":
        return renderMatrix(question);
      case "FU":
        return renderFile(question);
      default:
        return "";
    }
  }

  function renderQuestion(question) {
    var error = state.errors[question.id];
    return (
      '<article class="mf-q' +
      (error ? " is-invalid" : "") +
      '" data-question="' +
      esc(question.id) +
      '"><h3 class="mf-q-text">' +
      (question.required ? '<span class="mf-req" aria-hidden="true">*</span>' : "") +
      esc(text(question.text)) +
      "</h3>" +
      renderControl(question) +
      '<p class="mf-error" data-error-for="' +
      esc(question.id) +
      '"' +
      (error ? "" : " hidden") +
      ">" +
      esc(error || "") +
      "</p></article>"
    );
  }

  function renderSummary() {
    var rows = [];
    survey.pages.forEach(function (page) {
      (page.questions || []).forEach(function (question) {
        rows.push(
          "<li><span>" + esc(text(question.text)) + "</span><strong>" + esc(displayAnswer(question)) + "</strong></li>"
        );
      });
    });
    return (
      '<div class="mf-thanks"><h3>' +
      esc(ui("thanksTitle")) +
      "</h3><p>" +
      esc(ui("thanksBody")) +
      '</p><p class="mf-summary-title">' +
      esc(ui("summary")) +
      "</p><ul class=\"mf-summary\">" +
      rows.join("") +
      '</ul><button type="button" class="mf-btn mf-btn-ghost" data-action="again">' +
      esc(ui("again")) +
      "</button></div>"
    );
  }

  function buttonLabel() {
    return text(options.button.label) || "Feedback";
  }

  function renderShell() {
    var page = currentPage();
    var last = state.page === survey.pages.length - 1;
    var progress = Math.round(((state.page + (state.submitted ? 1 : 0)) / survey.pages.length) * 100);
    var body = state.submitted
      ? renderSummary()
      : (page.questions || []).map(renderQuestion).join("");
    var footer = state.submitted
      ? ""
      : '<footer class="mf-footer">' +
        '<button type="button" class="mf-btn mf-btn-ghost" data-action="prev"' +
        (state.page === 0 ? " disabled" : "") +
        ">" +
        esc(ui("previous")) +
        "</button>" +
        '<button type="button" class="mf-btn mf-btn-primary" data-action="' +
        (last ? "submit" : "next") +
        '">' +
        esc(last ? ui("submit") : ui("next")) +
        "</button></footer>";

    return (
      '<button type="button" class="mf-launcher" data-action="toggle" aria-haspopup="dialog" aria-expanded="' +
      (state.open ? "true" : "false") +
      '"><span class="mf-launcher-icon" aria-hidden="true">' +
      launcherIcon() +
      "</span><span>" +
      esc(buttonLabel()) +
      "</span></button>" +
      '<div class="mf-layer"' +
      (state.open ? "" : " hidden") +
      ">" +
      '<div class="mf-backdrop" data-action="close"></div>' +
      '<section class="mf-panel" role="dialog" aria-modal="true" aria-labelledby="mf-title">' +
      '<header class="mf-header"><div><p class="mf-kicker" id="mf-title">' +
      esc(text(survey.title)) +
      "</p><p class=\"mf-desc\">" +
      esc(text(survey.description)) +
      '</p></div><button type="button" class="mf-icon-btn" data-action="close" aria-label="' +
      esc(ui("close")) +
      '">×</button></header>' +
      '<div class="mf-progress" aria-hidden="true"><span style="width:' +
      progress +
      '%"></span></div>' +
      '<div class="mf-toolbar"><span>' +
      esc(ui("page")) +
      " " +
      (state.page + 1) +
      " " +
      esc(ui("of")) +
      " " +
      survey.pages.length +
      '</span><label class="mf-lang">' +
      esc(ui("language")) +
      '<select data-action="locale"><option value="en"' +
      (state.locale === "en" ? " selected" : "") +
      '>English</option><option value="ar"' +
      (state.locale === "ar" ? " selected" : "") +
      ">العربية</option></select></label></div>" +
      '<div class="mf-body">' +
      body +
      "</div>" +
      footer +
      "</section></div>"
    );
  }

  function launcherIcon() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16.5V7.8A2.8 2.8 0 0 1 7.8 5h8.4A2.8 2.8 0 0 1 19 7.8v5.4a2.8 2.8 0 0 1-2.8 2.8H9l-4 3z"></path></svg>';
  }

  var STYLES = [
    ":host{position:fixed;inset:0;z-index:var(--mf-z,2147483000);pointer-events:none;font-family:Segoe UI,Tahoma,sans-serif;color:#1c2430;}",
    "*,*::before,*::after{box-sizing:border-box;}",
    "button,input,textarea,select{font:inherit;}",
    ".mf-launcher,.mf-panel,.mf-backdrop,.mf-layer{pointer-events:auto;}",
    ".mf-launcher{position:fixed;display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 18px;border:0;background:var(--mf-button-bg,#0A3D78);color:var(--mf-button-fg,#fff);border-radius:var(--mf-button-radius,999px);box-shadow:0 10px 24px rgba(15,35,64,.22);cursor:pointer;font-size:15px;font-weight:600;line-height:1;}",
    ".mf-launcher:focus-visible,.mf-btn:focus-visible,.mf-icon-btn:focus-visible,.mf-input:focus-visible,select:focus-visible,.mf-choice input:focus-visible+span,.mf-nps-btn input:focus-visible+span{outline:2px solid #0A3D78;outline-offset:2px;}",
    ":host([data-position=bottom-right]) .mf-launcher{right:var(--mf-x,24px);bottom:var(--mf-y,24px);}",
    ":host([data-position=bottom-left]) .mf-launcher{left:var(--mf-x,24px);bottom:var(--mf-y,24px);}",
    ":host([data-position=top-right]) .mf-launcher{right:var(--mf-x,24px);top:var(--mf-y,24px);}",
    ":host([data-position=top-left]) .mf-launcher{left:var(--mf-x,24px);top:var(--mf-y,24px);}",
    ":host([data-position=bottom-right]) .mf-panel{right:var(--mf-x,24px);bottom:calc(var(--mf-y,24px) + 64px);}",
    ":host([data-position=bottom-left]) .mf-panel{left:var(--mf-x,24px);bottom:calc(var(--mf-y,24px) + 64px);}",
    ":host([data-position=top-right]) .mf-panel{right:var(--mf-x,24px);top:calc(var(--mf-y,24px) + 64px);}",
    ":host([data-position=top-left]) .mf-panel{left:var(--mf-x,24px);top:calc(var(--mf-y,24px) + 64px);}",
    ".mf-backdrop{position:fixed;inset:0;background:rgba(16,24,40,.28);}",
    ".mf-panel{position:fixed;width:min(440px,calc(100vw - 32px));max-height:min(680px,calc(100dvh - 120px));display:flex;flex-direction:column;background:#fff;border:1px solid #e4e8ee;border-radius:16px;box-shadow:0 18px 50px rgba(16,24,40,.18);overflow:hidden;}",
    ".mf-header{display:flex;justify-content:space-between;gap:12px;padding:16px 16px 8px;}",
    ".mf-kicker{margin:0;font-size:16px;font-weight:650;line-height:1.4;}",
    ".mf-desc{margin:4px 0 0;color:#5c6b7a;font-size:13px;line-height:1.5;}",
    ".mf-icon-btn{width:32px;height:32px;border:0;border-radius:8px;background:#f4f7fb;color:#1c2430;cursor:pointer;font-size:20px;line-height:1;}",
    ".mf-progress{height:3px;background:#e8eef5;margin:0 16px;border-radius:99px;overflow:hidden;}",
    ".mf-progress span{display:block;height:100%;background:var(--mf-button-bg,#0A3D78);}",
    ".mf-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 16px 0;color:#5c6b7a;font-size:12px;}",
    ".mf-lang{display:inline-flex;align-items:center;gap:6px;}",
    ".mf-lang select{border:1px solid #d5dde6;border-radius:8px;background:#fff;padding:4px 8px;color:#1c2430;}",
    ".mf-body{overflow:auto;padding:8px 16px 16px;}",
    ".mf-q{margin-top:16px;}",
    ".mf-q-text{margin:0 0 10px;font-size:14px;font-weight:600;line-height:1.5;}",
    ".mf-req{color:#d14343;margin-inline-end:4px;}",
    ".mf-error{min-height:0;margin:6px 0 0;color:#d14343;font-size:12px;}",
    ".mf-error[hidden]{display:none;}",
    ".mf-hint{margin:0 0 8px;color:#5c6b7a;font-size:12px;}",
    ".mf-choices,.mf-fields{display:flex;flex-direction:column;gap:8px;}",
    ".mf-choice{display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid #e4e8ee;border-radius:10px;background:#fff;cursor:pointer;font-size:14px;}",
    ".mf-choice:has(input:checked){border-color:var(--mf-button-bg,#0A3D78);background:#f3f7fc;}",
    ".mf-input{width:100%;border:1px solid #d5dde6;border-radius:10px;background:#fff;color:#1c2430;padding:10px 12px;font-size:14px;}",
    ".mf-field{display:flex;flex-direction:column;gap:6px;font-size:13px;color:#3d4b5c;}",
    ".mf-slider-meta{display:flex;justify-content:space-between;gap:8px;margin-top:6px;color:#5c6b7a;font-size:12px;}",
    ".mf-slider-meta strong{color:#1c2430;font-weight:650;}",
    "input[type=range]{width:100%;accent-color:var(--mf-button-bg,#0A3D78);}",
    ".mf-nps-scale{display:flex;gap:4px;overflow-x:auto;padding-bottom:2px;}",
    ".mf-nps-btn{flex:1 0 28px;position:relative;}",
    ".mf-nps-btn input{position:absolute;opacity:0;inset:0;margin:0;}",
    ".mf-nps-btn span{display:flex;align-items:center;justify-content:center;height:36px;border:1px solid #d5dde6;border-radius:8px;background:#fff;font-size:13px;}",
    ".mf-nps-btn:has(input:checked) span{background:var(--mf-button-bg,#0A3D78);color:#fff;border-color:transparent;}",
    ".mf-matrix-wrap{overflow-x:auto;}",
    ".mf-matrix{width:100%;border-collapse:collapse;font-size:12px;}",
    ".mf-matrix th,.mf-matrix td{padding:8px 6px;text-align:center;border-bottom:1px solid #eef2f6;font-weight:500;}",
    ".mf-matrix tbody th{text-align:start;font-weight:600;min-width:120px;}",
    ".mf-matrix-hit{display:inline-flex;position:relative;width:18px;height:18px;}",
    ".mf-matrix-hit input{margin:0;accent-color:var(--mf-button-bg,#0A3D78);width:18px;height:18px;}",
    ".mf-file{display:flex;flex-wrap:wrap;align-items:center;gap:8px;}",
    ".mf-file-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;min-height:36px;padding:0 12px;border:1px solid #d5dde6;border-radius:8px;background:#f4f7fb;cursor:pointer;font-size:13px;}",
    ".mf-file-btn input{position:absolute;inset:0;opacity:0;cursor:pointer;}",
    ".mf-file-name{font-size:13px;color:#3d4b5c;}",
    ".mf-footer{display:flex;justify-content:space-between;gap:8px;padding:12px 16px 16px;border-top:1px solid #eef2f6;}",
    ".mf-btn{min-height:40px;padding:0 16px;border-radius:10px;border:1px solid transparent;cursor:pointer;font-size:14px;font-weight:600;}",
    ".mf-btn:disabled{opacity:.45;cursor:not-allowed;}",
    ".mf-btn-primary{background:var(--mf-button-bg,#0A3D78);color:#fff;}",
    ".mf-btn-ghost{background:#fff;color:#1c2430;border-color:#d5dde6;}",
    ".mf-text-btn{border:0;background:transparent;color:#0A3D78;cursor:pointer;font-size:13px;padding:0;}",
    ".mf-thanks h3{margin:8px 0;font-size:18px;font-weight:650;}",
    ".mf-thanks p{margin:0 0 12px;color:#3d4b5c;font-size:14px;line-height:1.5;}",
    ".mf-summary-title{font-weight:650;color:#1c2430;}",
    ".mf-summary{list-style:none;margin:0 0 16px;padding:0;display:flex;flex-direction:column;gap:8px;}",
    ".mf-summary li{display:flex;flex-direction:column;gap:2px;padding:8px 10px;background:#f4f7fb;border-radius:8px;}",
    ".mf-summary span{color:#5c6b7a;font-size:12px;}",
    ".mf-summary strong{font-size:13px;font-weight:600;}",
    "@media (max-width:560px){.mf-panel{left:12px !important;right:12px !important;width:auto;max-height:min(78dvh,720px);}}",
    "@media (prefers-reduced-motion:reduce){.mf-panel,.mf-launcher{transition:none;animation:none;}}",
    "@media print{:host{display:none !important;}}",
  ].join("");

  function applyChrome() {
    host.style.position = "fixed";
    host.style.inset = "0";
    host.style.pointerEvents = "none";
    host.style.zIndex = String(options.zIndex);
    host.style.setProperty("--mf-z", String(options.zIndex));
    host.style.setProperty("--mf-x", (Number(options.offsetX) || 0) + "px");
    host.style.setProperty("--mf-y", (Number(options.offsetY) || 0) + "px");
    host.style.setProperty("--mf-button-bg", options.button.background || "#0A3D78");
    host.style.setProperty("--mf-button-fg", options.button.color || "#ffffff");
    host.style.setProperty("--mf-button-radius", (options.button.radius == null ? 999 : options.button.radius) + "px");
    host.dataset.position = options.position;
    host.dir = state.locale === "ar" ? "rtl" : "ltr";
    host.lang = state.locale;
  }

  function render(focusTarget) {
    applyChrome();
    root.innerHTML = renderShell();
    if (!state.open) return;
    var panel = root.querySelector(".mf-panel");
    if (focusTarget === "panel") {
      var closeBtn = root.querySelector('.mf-icon-btn[data-action="close"]');
      if (closeBtn) closeBtn.focus();
    } else if (focusTarget === "error") {
      var invalid = root.querySelector(".is-invalid input, .is-invalid textarea");
      if (invalid) invalid.focus();
      else if (panel) panel.focus();
    }
  }

  function setOpen(open) {
    state.open = open;
    render(open ? "panel" : null);
    if (!open) {
      var launcher = root.querySelector(".mf-launcher");
      if (launcher) launcher.focus();
    }
  }

  function clearError(questionId) {
    if (!state.errors[questionId]) return;
    delete state.errors[questionId];
    var node = root.querySelector('[data-error-for="' + questionId + '"]');
    var card = root.querySelector('[data-question="' + questionId + '"]');
    if (node) {
      node.hidden = true;
      node.textContent = "";
    }
    if (card) card.classList.remove("is-invalid");
  }

  function readField(input) {
    var questionId = input.getAttribute("data-qid");
    var kind = input.getAttribute("data-kind");
    if (!questionId || !kind) return;

    if (kind === "text") {
      state.answers[questionId] = input.value;
      clearError(questionId);
      return;
    }
    if (kind === "field" || kind === "numeric") {
      var current = Object.assign({}, state.answers[questionId] || {});
      var raw = input.value;
      current[input.getAttribute("data-field")] = kind === "numeric" ? raw.replace(/[^\d]/g, "") : raw;
      if (kind === "numeric" && current[input.getAttribute("data-field")] !== raw) {
        input.value = current[input.getAttribute("data-field")];
      }
      state.answers[questionId] = current;
      clearError(questionId);
      return;
    }
    if (kind === "choice") {
      if (input.type === "checkbox") {
        var list = (state.answers[questionId] || []).slice();
        var index = list.indexOf(input.value);
        if (input.checked && index === -1) list.push(input.value);
        if (!input.checked && index !== -1) list.splice(index, 1);
        state.answers[questionId] = list;
      } else {
        state.answers[questionId] = input.value;
      }
      clearError(questionId);
      return;
    }
    if (kind === "nps") {
      state.answers[questionId] = Number(input.value);
      clearError(questionId);
      return;
    }
    if (kind === "slider") {
      state.answers[questionId] = Number(input.value);
      input.removeAttribute("data-unset");
      var badge = root.querySelector('[data-slider-value="' + questionId + '"]');
      if (badge) badge.textContent = input.value;
      clearError(questionId);
      return;
    }
    if (kind === "matrix") {
      var matrix = Object.assign({}, state.answers[questionId] || {});
      matrix[input.getAttribute("data-row")] = input.value;
      state.answers[questionId] = matrix;
      clearError(questionId);
      return;
    }
    if (kind === "file") {
      var file = input.files && input.files[0];
      if (!file) return;
      var question = findQuestion(questionId);
      var maxMb = (question && question.config && question.config.maxSizeMb) || 5;
      var accept = ((question && question.config && question.config.accept) || "").toLowerCase();
      var extension = "." + (file.name.split(".").pop() || "").toLowerCase();
      if (accept && accept.split(",").indexOf(extension) === -1) {
        state.errors[questionId] = ui("fileType");
        input.value = "";
        render();
        return;
      }
      if (file.size > maxMb * 1024 * 1024) {
        state.errors[questionId] = ui("fileSize").replace("5", String(maxMb));
        input.value = "";
        render();
        return;
      }
      state.answers[questionId] = { name: file.name, size: file.size, type: file.type || extension };
      delete state.errors[questionId];
      render();
    }
  }

  function findQuestion(id) {
    for (var p = 0; p < survey.pages.length; p += 1) {
      var questions = survey.pages[p].questions || [];
      for (var i = 0; i < questions.length; i += 1) {
        if (questions[i].id === id) return questions[i];
      }
    }
    return null;
  }

  function goNext() {
    var errors = validatePage(currentPage());
    state.errors = errors;
    if (Object.keys(errors).length) {
      render("error");
      return;
    }
    if (state.page < survey.pages.length - 1) {
      state.page += 1;
      state.errors = {};
      render("panel");
    }
  }

  function goPrev() {
    if (state.page === 0) return;
    state.page -= 1;
    state.errors = {};
    render("panel");
  }

  function submit() {
    var errors = validatePage(currentPage());
    state.errors = errors;
    if (Object.keys(errors).length) {
      render("error");
      return;
    }
    state.submitted = true;
    state.lastResponse = buildResponse();
    render("panel");
    document.dispatchEvent(
      new CustomEvent("melqart-feedback:submit", { detail: state.lastResponse })
    );
  }

  function resetResponse() {
    state.answers = {};
    state.errors = {};
    state.page = 0;
    state.submitted = false;
    state.lastResponse = null;
    render("panel");
  }

  function onClick(event) {
    var trigger = event.target.closest("[data-action]");
    if (!trigger || !root.contains(trigger)) return;
    var action = trigger.getAttribute("data-action");
    if (action === "toggle") setOpen(!state.open);
    else if (action === "close") setOpen(false);
    else if (action === "next") goNext();
    else if (action === "prev") goPrev();
    else if (action === "submit") submit();
    else if (action === "again") resetResponse();
    else if (action === "clear-file") {
      delete state.answers[trigger.getAttribute("data-qid")];
      render();
    }
  }

  function onChange(event) {
    var target = event.target;
    if (!target || !root.contains(target)) return;
    if (target.getAttribute("data-action") === "locale") {
      state.locale = target.value === "ar" ? "ar" : "en";
      render();
      return;
    }
    readField(target);
  }

  function onInput(event) {
    var target = event.target;
    if (!target || !root.contains(target)) return;
    var kind = target.getAttribute("data-kind");
    if (kind === "text" || kind === "field" || kind === "numeric" || kind === "slider") readField(target);
  }

  function onKeyDown(event) {
    if (!state.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    var panel = root.querySelector(".mf-panel");
    if (!panel) return;
    var focusable = panel.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    var active = shadow.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function mount() {
    host = document.createElement("melqart-feedback");
    document.documentElement.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent = STYLES;
    shadow.appendChild(style);
    var app = document.createElement("div");
    app.className = "mf-app";
    shadow.appendChild(app);
    root = app;
    root.addEventListener("click", onClick);
    root.addEventListener("change", onChange);
    root.addEventListener("input", onInput);
    root.addEventListener("keydown", onKeyDown);
    render();

    var api = {
      open: function () {
        setOpen(true);
      },
      close: function () {
        setOpen(false);
      },
      toggle: function () {
        setOpen(!state.open);
      },
      setLocale: function (locale) {
        state.locale = locale === "ar" ? "ar" : "en";
        render(state.open ? "panel" : null);
      },
      setPlacement: function (placement) {
        mergeOptions(options, placement || {});
        render(state.open ? "panel" : null);
      },
      setButton: function (button) {
        mergeOptions(options, { button: button || {} });
        render(state.open ? "panel" : null);
      },
      getSurvey: function () {
        return survey;
      },
      getResponse: function () {
        return state.lastResponse;
      },
    };
    window.MelqartFeedback = api;
    window.MelqartFeedbackSurvey = survey;
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
