import React from "react";
import Accordion from "../utils/Accordion";
import "../styles/About.css";

const About = () => {
  const faqs = [
    {
      title: "Why was Match Israel founded?",
      content: [
        "Match Israel was founded to help bridge the gap between international donors and small Israeli non-profits. We recognized that many people either were interested in exploring new causes in Israel or wanted a genuine connection to an organization so they could get involved and see where their money was going.",
        "We're here to help you find the next cause your passionate about.",
      ],
    },
    {
      title: "Aren't there websites that do this already?",
      content: [
        "We hope to be much more than a website in the future, but for now, that's where we are testing our product. If all goes well, we hope to expand much further!",
        "To answer the question more directly, not exactly. There are no platforms using AI to match non-profits to donors. There are plenty of websites showcasing non-profits, but potential donors must search manually through thousands of pages. We give you all the information on one screen with just a conversation!",
        "While there are plenty of crowdfunding organizations, none allow you to contact a representative directly and get 1:1 time with them. Match Israel emphasizes that connections are key—both for you and the organization. If you know the story of the non-profit and the people behind it, you're more likely to donate and feel satisfied with your donation.",
      ],
    },
    {
      title:
        "What do you mean all of your featured non-profits are 'small' and 'vetted'?",
      content: [
        "I'm glad you asked that! We're looking for non-profits that are lean and driving impact from the ground-up but at the same time are hungry for resources to grow. We believe small non-profits have the ability to do that, which we define as having an annual budget of under 10,000,000 Shekel.",
        "In terms of the vetting process, Match Israel didn't do that ourselves. We rely on an organization called Midot, which has a comprehensive process of vetting non-profits for efficiency, impact, and viability. All of our organizations have Midot's “Seal of Effectiveness.'",
      ],
    },
    {
      title: "Is there an expected minimum donation to schedule a meeting?",
      content: [
        "No. All of our non-profits expressed willingness to meet with anyone, regardless of the size of the expected donation. You can donate annually, biannually, monthly, or however you see fit!",
        "That said, we ask you to be considerate. If you really don't think you're going to donate to an organization, please don't schedule a meeting with them. These are smaller NGOs with limited resources, one of which is time, so please keep that in mind.",
      ],
    },
    {
      title: "Are all of my donations tax-deductible in the US?",
      content:
        "Most of our featured non-profits have this status, but make sure to check on their donation page or talk with Ezra, our chatbox assistant.",
    },
    {
      title: "Why would I want to connect to a non-profit instead of donating?",
      content:
        "Well, we hope you do both! Some people prefer to just give money and forget about it, which is completely allowed. Others prefer to know where their money is going and develop a connection, so we simply provide them that option.",
    },
    {
      title: "How does Match Israel make money?",
      content:
        "At this stage, we don't. We're just a group of dudes looking to help small Israeli non-profits make a difference. We're actually paying out of our pockets to make a difference, and we're happy to!",
    },
    {
      title: "How can I contact the non-profits?",
      content:
        "Ask Ezra or see the featured non-profits section of our website and reach out via email or WhatsApp the non-profit of your choice!",
    },
    {
      title:
        "Why should I donate to causes that don't have to deal with October 7 and the subsequent war?",
      content:
        "The choice is up to you, of course! The war has generated a lot of donations, but that also means non-profits not working with the war have lost a lot of donations, so your donation may be more important there!",
    },
  ];

  return (
    <div className="about-container">
      <section className="about-intro">
        <h1>About Match Israel</h1>
        <p>
          Following the tragic events of October 7th, the worldwide Jewish
          community united to help their brethren in Israel. Springing into
          action, global Jewry donated billions of dollars to Israel, supporting
          non-profits, soldiers, communities, individuals, and the country. The
          financial inflows have truly proved to be lifesaving.
        </p>
        <p>
          Match Israel was founded in early 2025 to help donors outside of
          Israel continue this imperative assistance. Match Israel showcases
          small and vetted non-profits who are doing crucial work for Israeli
          society, both related to the events of October 7th and beyond. We
          recognized that a challenge for many smaller, non-institutional donors
          if figuring out where to donate in the first place. With so many large
          organizations raising tens of millions of dollars, smaller non-profits
          were left behind, especially those not connected to the war efforts,
          who continue their crucial work with less funds.
        </p>
        <p>
          Our aim is to help you find a non-profit you can be proud of donating
          to through AI. We've done the research, found vetted non-profits, and
          built the database to make the information easy and accessible to you.
          All you have to do is have a conversation with Ezra, our AI assistant,
          and must importantly, donate!
        </p>
        <p>
          As an added bonus, we want to give donors the opportunity to connect
          with the organizations and the people themselves. We believe that
          having a connection to the non-profits you're donating to will make
          your donation feel more fulfilling. You'll be able to keep in touch
          with the organization and see firsthand how far your donation goes, if
          you so choose.
        </p>
        <p>
          All of our featured non-profits have agreed to be contacted directly
          by you—all you have to do is click the button to send an email or
          WhatsApp and they'll get back to you to schedule a meeting. It's that
          simple. They want to hear from you!
        </p>
      </section>

      <section className="about-faqs">
        <h2>FAQs</h2>
        <div className="accordion-container">
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              title={faq.title}
              content={faq.content}
              listIdx={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
