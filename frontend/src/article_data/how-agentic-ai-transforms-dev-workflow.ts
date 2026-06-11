export const content = `
## What is AI
Artificial Intelligence or AI are computer programs that try to mimic human intelligence, problem solving etc to perform tasks that a human could perform. In business it is used in customer churn prediction, inventory management etc.

## What Agentic AI Actually Is
Agentic AI refers to autonomous systems that utilizes the help of AI Agents to complete complex tasks with minimal human oversight. They work iteratively while planning and executing a multi step workflow. Unlike traditional AI systems that work prompt by prompt they can make autonomous decisions to complete a task.
As technology is progressing software development, its principles and roles also keep on evolving. In early days, developers had to manually test and deploy their software which was a hectic task but now with automated testing frameworks, Continuous Integration and Continuous Deployment pipelines many of the developers tasks are not only becoming easy but also these are giving rise to different fields. Today we are seeing one of the biggest developments which is the rise of Agentic AI which due to its abilities to plan and execute complex tasks can fundamentally change how software is built and shipped.

## Automated SDLC
As highlighted in a recent CIO article, in 2026 AI won't just assist developers but also execute large parts of SOftware Development LifeCycle allowing engineers to focus on strategy and system architecture of the system. Many enterprises are also working to integrate Agentic AI in their workflow to automate many parts of SDLC. This compresses what used to take days to just hours.

## Human Supervision
Although the agentic AI systems are powerful but not flawless. They can write code but those solutions often require refinement. So rather than just writing code from scratch developers guide the agent, review its output, and make corrections. Rather taking on all the tasks themselves they delegate the task of creation to AI systems and supervise the Agentic AI. Many developers describe this as a “70 percent solution” as 70 percent work is done by Agentic AI and the remaining 30 percent is to be done by engineers.

## Real World Examples
Below are some of the examples showing how Agentic AI executes instructions by breaking ideas to structural tasks.

### Agentic AI in Software Development
Recently a friend of mine was given a task to create a hostel management system. He was to first read the entire code base of the previous outdated hostel management system and then implement the new one by extracting the features list from the old system. Rather than just manually reading the entire code base what he did was to use Claude Code to extract the features and explain the working flow of code. 
Then he gave all the information to a Planner Agent which, depending on the information and flow extracted from the previous system, broke the high level requirement into structural tasks. Then it selected a tech stack and frameworks and optimized the tools accordingly.
Then he used a developer agent to start implementation. It created backend endpoints, database connection etc and one of the things he was amazed about was how it not only did not generate code but also checked for dependencies and continuously tested the code for bugs and errors. If he had manually coded the entire hostel management system from scratch it would surely take him days but now he could do it in a single day and submit a fully working, scalable and efficient system.

### Agentic AI in a Machine Learning Pipeline
Recently I also had to create a ML project as a semester project. I was building a brain tumor detection system using medical images. The very same friend of mine gave me the advice of using Claude Code for this project and I was shocked by how well it performs. First I used a data Agent to collect multiple data sets. It then checks data for missing labels, class imbalances and image sizes and then applies different types of pre processing steps.
Then came the Model Agent which depending on task requirement, performance needs selected an architecture (U-Net). It trained the model on the data set and monitored performance metrics like accuracy etc in real time. Then the Tuning Agent  comes into play by carrying multiple side by side experiments using different hyper parameters and choosing the hyper parameter which gives the best performance metrics. Then an evaluation agent analyzes the model. It generates the results and gives a document of the performance of the model.Finally a deployment agent handles all the tasks of deployment and future training if needed.

These examples are just the tip of the iceberg. As Agentic AI is maturing it continues to expand beyond the software development workflows. Such as a mail agent which analyzes mails and priority and summarizes them for faster reading etc. A scheduling agent that autonomously organizes meetings, resolves conflicts and generates meeting summaries. In this way a seamless partnership is developed as the human creativity is amplified with the speed and consistency of Agentic AI systems.

## Conclusion
To conclude, Agentic AI is redefining the way humans interact with technology. Previously the tasks engineers had to do manually like reading large codebases, extracting workflows, creating SDLC documents, implementing code and testing the code which took days or weeks now can only be completed within hours with the help of Agentic AI which helps humans to focus on high level strategy, innovation, and creative problem-solving instead of repetitive or time-consuming tasks.
`;

export const timeline = [
	"Delegate repetitive tasks first: tests, docs, refactors, and boilerplate",
	"Run agents in parallel workflows, then merge with human code review",
	"Add guardrails for security changes, dependencies, and deploy approvals",
	"Track cycle time, bug rate, and review latency to prove impact",
	"Scale usage with team playbooks and shared standards",
];
