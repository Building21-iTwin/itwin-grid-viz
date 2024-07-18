import { QueryBinder, QueryRowFormat } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { Presentation } from "@itwin/presentation-frontend";

async function selectCategory(ids: string[]) {
  const iModel = IModelApp.viewManager.selectedView?.iModel;
  if (iModel) {
    const queryReader = iModel.createQueryReader(
      "SELECT ec_classname(ECClassId, 's:c') as [classname], ECInstanceId as [id] FROM bis.GeometricElement3d WHERE InVirtualSet(?, Category.Id)",
      QueryBinder.from([ids]),
      { rowFormat: QueryRowFormat.UseECSqlPropertyNames }
    );
    const elements = await queryReader.toArray();
    Presentation.selection.replaceSelection(
      "category",
      iModel,
      elements.map((element) => ({
        id: element.id,
        className: element.classname,
      }))
    );
  }
}

export default selectCategory;
