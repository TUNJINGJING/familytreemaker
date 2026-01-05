import { Icon } from "@iconify/react";

export default function FeaturesSection() {
  const features = [
    {
      icon: "solar:graph-new-up-line-duotone",
      title: "Interactive Visualization",
      description: "Zoom, pan, and navigate through your family tree with smooth animations and transitions.",
    },
    {
      icon: "solar:pen-new-square-line-duotone",
      title: "Easy Editing",
      description: "Add, edit, and delete family members with a simple and intuitive interface.",
    },
    {
      icon: "solar:gallery-wide-line-duotone",
      title: "Photo Support",
      description: "Add photos to each family member to bring your family history to life.",
    },
    {
      icon: "solar:smartphone-2-line-duotone",
      title: "Mobile Friendly",
      description: "Access and edit your family tree from any device, anywhere.",
    },
    {
      icon: "solar:share-line-duotone",
      title: "Easy Sharing",
      description: "Generate shareable links to let family members view your tree.",
    },
    {
      icon: "solar:download-minimalistic-line-duotone",
      title: "Export Options",
      description: "Download your family tree as PDF or PNG for printing or archiving.",
    },
  ];

  return (
    <section id="features" className="z-20 flex flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-7xl flex-col items-center gap-16">
        <div className="text-center">
          <h2 className="mb-4 py-4 text-4xl font-extrabold text-blue-700 md:text-5xl">
            Everything You Need
          </h2>
          <p className="text-xl leading-relaxed text-gray-700">
            Powerful features to create and share your family history
          </p>
        </div>

        <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                    <Icon icon={feature.icon} width={24} height={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
