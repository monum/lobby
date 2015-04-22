<!DOCTYPE html>
<html>
<head>
<title>{{ branding.title }}</title>
<link href="css/onepagescroll.css" rel="stylesheet" type="text/css">
<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css">
<script src="js/bootstrap.min.js"></script>
<script src="js/onepagescroll.min.js"></script>
</head>
<body>
  <div class="main">
    {% for source in sources %}
    <section {% if source.src %}data-source="{{source.src}}"{% endif %}>
      <h1>{{ source.title }} <small>{{ source.desc }}</small></h1>
    </section>
    {% endfor %}
  </div>
  <script>onePageScroll(".main");</script>
</body>
</html>