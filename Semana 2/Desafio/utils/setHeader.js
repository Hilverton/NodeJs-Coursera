const Header = (res, item) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(item);
  return;
}

module.exports = Header;