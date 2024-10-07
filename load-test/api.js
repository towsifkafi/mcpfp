import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const requestCounter = new Counter('total_requests');

function randomUsername() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  for (let i = 0; i < 8; i++) {
    username += chars[Math.floor(Math.random() * chars.length)];
  }
  return username;
}

export const options = {
  vus: 1000,
  duration: '30s', 
};

export default function () {
  const username = randomUsername();
  const url = `http://localhost:9002/api/pfp/normal/${username}.png`;

  const res = http.get(url);
  console.log(`Response time for ${url}: ${res.timings.duration} ms`);
  requestCounter.add(1);

  check(res, {
    'status was 200': (r) => r.status === 200,
  });

  //sleep(1);
}