import { Stack, Text } from "office-ui-fabric-react"
import * as React from "react"

const CustomText: React.FC = ({
  children
}) => {
  return (
    <Stack horizontalAlign='center'>
      <Text>
        {children}
      </Text>
    </Stack>
  )
}

export default CustomText;