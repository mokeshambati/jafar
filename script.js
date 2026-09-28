
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav-links');

if(menu){
  menu.addEventListener('click', () => nav.classList.toggle('open'));
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => nav?.classList.remove('open'));
});

document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/*
  CONTACT FORM
  Uses FormSubmit's AJAX endpoint so visitors stay on the portfolio page.
  The recipient is read from data-recipient on #contactForm.
  Before the first real submission, FormSubmit sends a one-time activation
  email to the recipient address.
*/
const form = document.querySelector('#contactForm');

if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const note = document.querySelector('#formNotice');
    const button = document.querySelector('#sendBtn');
    const recipient = form.dataset.recipient;

    if(!recipient){
      note.textContent = 'Please set the portfolio email address in contact.html.';
      note.style.color = '#ffb4b4';
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    button.disabled = true;
    button.textContent = 'Sending...';
    note.textContent = 'Sending your message...';
    note.style.color = '';

    try{
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...payload,
          _subject: 'New portfolio contact message',
          _template: 'table'
        })
      });

      const result = await response.json();

      if(response.ok && result.success !== false){
        note.textContent = 'Message sent successfully. Thank you for reaching out!';
        note.style.color = '#bfeee1';
        form.reset();
      }else{
        throw new Error(result.message || 'Unable to send the message.');
      }
    }catch(error){
      note.textContent = 'Message could not be sent. Please try again or use the email/LinkedIn links.';
      note.style.color = '#ffb4b4';
    }finally{
      button.disabled = false;
      button.textContent = 'Send message ↗';
    }
  });
}
