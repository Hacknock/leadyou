# New README.md format proposal

## What GitHub and Bitbucket mentioned about README.md

As we mentioned in [What is README?](https://leadyou.hacknock.com), Github has this to say about README.md

> You can add a README file to your repository to tell other people why your project is useful, what they can do with your project, and how they can use it.  
> (Quote it from [About READMEs](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-readmes) written by GitHub)

Bitbucket also says the following about README.md as well

> A README is a reference for other users visiting your repository and documents steps for them to get your application up and running. You can either add and edit your README file locally or straight from Bitbucket Cloud.  
> (Quote it from [README content](https://support.atlassian.com/bitbucket-cloud/docs/readme-content/) written by Bitbucket)

Github says a README should describe what users can do with your project, how they can use it, and why it's useful.
Bitbucket states that a README is a reference for users, documenting the steps of how to get your application up and running when they use your project.
The README is therefore an overview of how to use your project, as well as providing an incentive for users to use and contribute to your project by demonstrating its usefulness to other users of your public repository, including the ability to solve problems that have not been solved in other projects and to achieve things that have not been possible before.
To indicate this, GitHub indicates that it should include the following five pieces of content

- What the project does
- Why the project is useful
- How users can get started with the project
- Where users can get help with your project
- Who maintains and contributes to the project

## The reason why we proposed new README format

Most projects fail to achieve what I have described in the previous section.
Even the open source projects we use frequently, which I won't name specifically, do not have enough information in their READMEs to fulfill the previous section.
Therefore, developers do not get the information they need to use the open source from its README in many cases.
We wondered if this was due to the lack of a unified format for writing READMEs.
Therefore, we propose a unified format that meets the recommended requirements for READMEs as stated by GitHub and Bitbucket, based on the ways of writing papers as a way of sharing knowledge.

## Our proposed README format

Here are some of the specifics that we propose to include in our README

### Project Name (Required)

The name of your project is important because it is how you want your users to call you, as well as your brand.
This field is required in [README Generator](https://generator.hacknock.com).

### Badges

To give developers an at-a-glance view of your project's status, it is recommended that you display the badges provided by [Shields IO](https://shields.io/).
This item is recommended in [README Generator](https://generator.hacknock.com).

### Tags (Required)

Tags are keywords for your project.
It is important for users to know the language and framework used in your project at a glance.
This field is required in the [README Generator](https://generator.hacknock.com).

### Short Description (Required)

A Short Description is important for users to understand the big picture of your project in a concise way.
There are three things you should include: how your project was developed and published (what frameworks and open source issues exist and what hasn't been accomplished), your idea for solving it, and what your project can do.

_Example_

> The challenge is that using only the official framework for handling hogehoge is cumbersome for users to write.
> My idea is to solve this problem by providing a simple interface to wrap these codes and handle the hogehoge process.
> My project provides a wrapper library that you can use to write simple code to handle hogehoge.

This field is required in the [README Generator](https://generator.hacknock.com).

### Demo

This information is for the developer to see your project in action.
We recommend that you show them how it works with images, especially if it includes a user interface.
This field is required in the [README Generator](https://generator.hacknock.com).

### Advantages (Required)

It is important for developers to determine the usefulness of your project.
You should describe in this section the benefits of your project to users compared to other open source and frameworks.
You should use bullet points to make it concise and easy for developers to understand.

_Example_

> - Concise code description is possible.
> - There are no dependencies with other libraries, and you only need to install this project to use it.
> - It uses the APIs of the official frameworks, so it works fast.

This field is required in the [README Generator](https://generator.hacknock.com).

### Installation (Required)

This is the information developers need to implement your project.
Describe the specific ways to implement it.
Try to write in a reproducible manner. In other words, write scripts for the environment in which you will be running, the dependencies you will need to implement, and the shells you will need to install.
This field is required in the [README Generator](https://generator.hacknock.com).

### Deployment

This is the information developers will need to deploy your project.
This may not be necessary for all projects, but please write any code or procedures you need to deploy, such as working with the necessary dependencies.
This section is recommended in [README Generator](https://generator.hacknock.com).

### Minimal Example (Required)

This is important information to make it easy for developers to know how to use your project.
Look at this section to see how easy it is to use and the code for the actual use of the project.
This section can also be used to verify that your uses are successful in implementing your project.
It is likely that your users will refer to this section as a tutorial when they are deploying your project.
This field is required by [README Generator](https://generator.hacknock.com).

### Contributors (Required)

Many large and popular projects have several contributors.
It is important to know who is involved in your project so that we can recognize the contributions of your project' contributors.
We believe that rewarding contributors' efforts will help open source to grow.
This field is required in [README Generator](https://generator.hacknock.com).

### Users

Please list any users who use your project.
This information will help users determine the reliability of your project.
This is a recommended field in [README Generator](https://generator.hacknock.com).

## Edit History

- 2020-08-15) First proposal by Akira Kashihara and Takuto Nakamura
