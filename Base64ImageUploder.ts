export const postSponsorData = async (req: Request, res: Response) => {
  const userId = res.locals.user.userId;
  const { basicInfoSection, faqSection, rewardSection } = req.body;
  const {
    sponsorPageName,
    sponsorPageCaption,
    sponsorPageCategory,
    amount,
    textField,
    videoUrl,
    uploadImage,
  } = basicInfoSection;

  try {
    const staticurl = `www.gofudher.com/${basicInfoSection.sponsorPageURL}`;
    // const newData = await sponsorDataModel.create({
    //   ...req.body,
    //   userId,
    //   sponsorPageURL: staticurl,
    //   sponsorPageName,
    //   sponsorPageCaption,
    //   sponsorPageCategory,
    //   amount,
    //   textField,
    //   videoUrl,
    //   uploadImage,
    // });
    // console.log("uploadImage", uploadImage);

    const base64Data = uploadImage.split(",")[1];

    const base64 = uploadImage.split(",")[0];

    const fileSplit = base64.split("image/")[1];

    const fileType = fileSplit.split(";")[0];

    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `${Date.now()}.${fileType}`;

    const filePath = path.join(__dirname, "../../public/profile", fileName);
    fs.writeFile(filePath, buffer, { encoding: "base64" }, (error: any) => {
      if (error) {
        console.error(error);
        return;
      }
      // console.log("File saved successfully!");

      const uploadImage = {
        name: fileName,
        type: "image/jpeg",
        size: buffer.length,
        path: filePath,
      };
    });

    const imageUrl = `${process.env.SERVER_URL}/${
      filePath.split("public/")[1]
    }`;

    const newData = await sponsorDataModel.create({
      userId,
      ...req.body,
      sponsorPageURL: staticurl,
      sponsorPageName,
      sponsorPageCaption,
      sponsorPageCategory,
      amount,
      textField,
      videoUrl,
      uploadImage: imageUrl,
      updatedAt: Date.now(),
    });

    for (let i = 0; i < faqSection.length; i++) {
      let faqData = faqSection[i];
      await sponsorFaqModelData.create({
        ...faqData,
        userId,
        basicInfo: newData._id,
      });
    }

    for (let i = 0; i < rewardSection.length; i++) {
      const {
        rewardTitle,
        rewardType,
        youtubeVideoLink,
        sponsorshipAmount,
        rewardDescription,
        rewardImage,
      } = rewardSection[i];

      const base64Data = rewardImage.split(",")[1];

      const base64 = rewardImage.split(",")[0];

      const fileSplit = base64.split("image/")[1];

      const fileType = fileSplit.split(";")[0];

      const buffer = Buffer.from(base64Data, "base64");

      const fileName = `${Date.now()}.${fileType}`;

      const filePath = path.join(__dirname, "../../public/profile", fileName);
      fs.writeFile(filePath, buffer, { encoding: "base64" }, (error: any) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log("File saved successfully!");
        const rewardImage = {
          name: fileName,
          type: "image/jpeg",
          size: buffer.length,
          path: filePath,
        };
      });

      const imageUrl = `${process.env.SERVER_URL}/${
        filePath.split("public/")[1]
      }`;
      const newDataReward = await rewardModelData.create({
        userId,
        basicInfo: newData._id,
        rewardTitle,
        rewardType,
        youtubeVideoLink,
        sponsorshipAmount,
        rewardDescription,
        rewardImage: imageUrl,
        updatedAt: Date.now(),
      });
      res.status(201).json({ success: true, message: "Data saved" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};
